package errors

import (
	"database/sql"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
)

func TestHandler(t *testing.T) {
	logger := logrus.New()
	logger.SetOutput(nil) // Suppress log output during tests

	t.Run("normal request processing", func(t *testing.T) {
		req, res := buildRequest("GET", "/test")
		router := mux.NewRouter()
		router.Use(Handler(logger))
		router.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("OK"))
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusOK, res.Code)
		assert.Equal(t, "OK", res.Body.String())
	})

	t.Run("error response handling", func(t *testing.T) {
		req, res := buildRequest("GET", "/error")
		router := mux.NewRouter()
		router.Use(Handler(logger))
		router.HandleFunc("/error", func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "custom error", http.StatusBadRequest)
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusBadRequest, res.Code)
		assert.Contains(t, res.Body.String(), "custom error")
	})

	t.Run("panic handling", func(t *testing.T) {
		req, res := buildRequest("GET", "/panic")
		router := mux.NewRouter()
		router.Use(Handler(logger))
		router.HandleFunc("/panic", func(w http.ResponseWriter, r *http.Request) {
			panic("unexpected error")
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusInternalServerError, res.Code)
		assert.Contains(t, res.Body.String(), "Internal server error")
	})

	t.Run("sql.ErrNoRows handling", func(t *testing.T) {
		req, res := buildRequest("GET", "/notfound")
		router := mux.NewRouter()
		router.Use(Handler(logger))
		router.HandleFunc("/notfound", func(w http.ResponseWriter, r *http.Request) {
			err := sql.ErrNoRows
			http.Error(w, buildErrorResponse(err).Message, buildErrorResponse(err).StatusCode())
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusNotFound, res.Code)
		assert.Contains(t, res.Body.String(), "Resource not found")
	})

	t.Run("generic internal server error", func(t *testing.T) {
		req, res := buildRequest("GET", "/internalerror")
		router := mux.NewRouter()
		router.Use(Handler(logger))
		router.HandleFunc("/internalerror", func(w http.ResponseWriter, r *http.Request) {
			err := errors.New("some internal issue")
			http.Error(w, buildErrorResponse(err).Message, buildErrorResponse(err).StatusCode())
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusInternalServerError, res.Code)
		assert.Contains(t, res.Body.String(), "Internal server error")
	})
}

// buildRequest creates a new test HTTP request
func buildRequest(method, url string) (*http.Request, *httptest.ResponseRecorder) {
	req, _ := http.NewRequest(method, url, nil)
	res := httptest.NewRecorder()
	return req, res
}
