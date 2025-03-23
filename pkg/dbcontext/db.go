package dbcontext

import (
	"context"
	"net/http"

	dbx "github.com/go-ozzo/ozzo-dbx"
	"github.com/gorilla/mux"
)

// DB represents a DB connection that can be used to run SQL queries.
type DB struct {
	db *dbx.DB
}

// TransactionFunc represents a function that will start a transaction and run the given function.
type TransactionFunc func(ctx context.Context, f func(ctx context.Context) error) error

type contextKey int

const (
	txKey contextKey = iota
)

// New returns a new DB connection that wraps the given dbx.DB instance.
func New(db *dbx.DB) *DB {
	return &DB{db}
}

// DB returns the dbx.DB wrapped by this object.
func (db *DB) DB() *dbx.DB {
	return db.db
}

// With returns a Builder that can be used to build and execute SQL queries.
// With will return the transaction if it is found in the given context.
// Otherwise, it will return a DB connection associated with the context.
func (db *DB) With(ctx context.Context) dbx.Builder {
	if tx, ok := ctx.Value(txKey).(*dbx.Tx); ok {
		return tx
	}
	return db.db.WithContext(ctx)
}

// Transactional starts a transaction and calls the given function with a context storing the transaction.
// The transaction associated with the context can be accessed via With().
func (db *DB) Transactional(ctx context.Context, f func(ctx context.Context) error) error {
	return db.db.TransactionalContext(ctx, nil, func(tx *dbx.Tx) error {
		return f(context.WithValue(ctx, txKey, tx))
	})
}

// TransactionMiddleware returns a middleware that starts a transaction.
// The transaction started is kept in the request context and can be accessed via With().
func (db *DB) TransactionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := db.db.TransactionalContext(r.Context(), nil, func(tx *dbx.Tx) error {
			ctx := context.WithValue(r.Context(), txKey, tx)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
			return nil
		})

		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	})
}

// ApplyMiddleware applies the transaction middleware to a mux router.
func (db *DB) ApplyMiddleware(router *mux.Router) {
	router.Use(db.TransactionMiddleware)
}
