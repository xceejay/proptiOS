package errors

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"runtime/debug"

	"github.com/sirupsen/logrus"
)

// Logger instance
var logger = logrus.New()

// Middleware creates a middleware that handles panics and errors.
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if e := recover(); e != nil {
				var err error
				if errConv, ok := e.(error); ok {
					err = errConv
				} else {
					err = fmt.Errorf("%v", e)
				}

				logger.Errorf("Recovered from panic (%v): %s", err, debug.Stack())
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
		}()

		next.ServeHTTP(w, r)
	})
}

// buildErrorResponse builds an error response from an error.
func buildErrorResponse(err error) (int, string) {
	//switch err.(type) {
	//case *mux.Error:
	//return http.StatusInternalServerError, "Internal Server Error"
	//}

	if errors.Is(err, sql.ErrNoRows) {
		return http.StatusNotFound, "Resource not found"
	}
	return http.StatusInternalServerError, "Internal Server Error"
}
