package dbcontext

import (
	"context"
	"database/sql"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	dbx "github.com/go-ozzo/ozzo-dbx"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq" // initialize PostgreSQL for tests
	"github.com/stretchr/testify/assert"
)

const DSN = "postgres://127.0.0.1/go_restful?sslmode=disable&user=postgres&password=postgres"

func TestNew(t *testing.T) {
	runDBTest(t, func(db *dbx.DB) {
		dbc := New(db)
		assert.NotNil(t, dbc)
		assert.Equal(t, db, dbc.DB())
	})
}

func TestDB_Transactional(t *testing.T) {
	runDBTest(t, func(db *dbx.DB) {
		assert.Zero(t, runCountQuery(t, db))
		dbc := New(db)

		// successful transaction
		err := dbc.Transactional(context.Background(), func(ctx context.Context) error {
			_, err := dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "1", "name": "name1"}).Execute()
			assert.Nil(t, err)
			_, err = dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "2", "name": "name2"}).Execute()
			assert.Nil(t, err)
			return nil
		})
		assert.Nil(t, err)
		assert.Equal(t, 2, runCountQuery(t, db))

		// failed transaction
		err = dbc.Transactional(context.Background(), func(ctx context.Context) error {
			_, err := dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "3", "name": "name1"}).Execute()
			assert.Nil(t, err)
			_, err = dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "4", "name": "name2"}).Execute()
			assert.Nil(t, err)
			return sql.ErrNoRows
		})
		assert.Equal(t, sql.ErrNoRows, err)
		assert.Equal(t, 2, runCountQuery(t, db))
	})
}

func TestDB_TransactionHandler(t *testing.T) {
	runDBTest(t, func(db *dbx.DB) {
		assert.Zero(t, runCountQuery(t, db))
		dbc := New(db)
		router := mux.NewRouter()

		// Define transaction middleware
		txMiddleware := func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				ctx := r.Context()
				err := dbc.Transactional(ctx, func(txCtx context.Context) error {
					r = r.WithContext(txCtx)
					next.ServeHTTP(w, r)
					return nil
				})
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}
			})
		}

		router.Use(txMiddleware)

		// Successful transaction handler
		router.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			_, err := dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "1", "name": "name1"}).Execute()
			assert.Nil(t, err)
			_, err = dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "2", "name": "name2"}).Execute()
			assert.Nil(t, err)
			w.WriteHeader(http.StatusOK)
		}).Methods("GET")

		// Send request to the router
		res := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/users", nil)
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusOK, res.Code)
		assert.Equal(t, 2, runCountQuery(t, db))

		// Failed transaction handler
		router.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			_, err := dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "3", "name": "name1"}).Execute()
			assert.Nil(t, err)
			_, err = dbc.With(ctx).Insert("dbcontexttest", dbx.Params{"id": "4", "name": "name2"}).Execute()
			assert.Nil(t, err)
			http.Error(w, "transaction failed", http.StatusInternalServerError)
		}).Methods("POST")

		// Send failed request
		res = httptest.NewRecorder()
		req, _ = http.NewRequest("POST", "/users", nil)
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusInternalServerError, res.Code)
		assert.Equal(t, 2, runCountQuery(t, db))
	})
}

func runDBTest(t *testing.T, f func(db *dbx.DB)) {
	dsn, ok := os.LookupEnv("APP_DSN")
	if !ok {
		dsn = DSN
	}
	db, err := dbx.MustOpen("postgres", dsn)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}
	defer func() {
		_ = db.Close()
	}()

	sqls := []string{
		"CREATE TABLE IF NOT EXISTS dbcontexttest (id VARCHAR PRIMARY KEY, name VARCHAR)",
		"TRUNCATE dbcontexttest",
	}
	for _, s := range sqls {
		_, err = db.NewQuery(s).Execute()
		if err != nil {
			t.Error(err, " with SQL: ", s)
			t.FailNow()
		}
	}

	f(db)
}

func runCountQuery(t *testing.T, db *dbx.DB) int {
	var count int
	err := db.NewQuery("SELECT COUNT(*) FROM dbcontexttest").Row(&count)
	assert.Nil(t, err)
	return count
}
