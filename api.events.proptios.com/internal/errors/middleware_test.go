package errors

import (
	"database/sql"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
)

func TestHandler(t *testing.T) {
	t.Run("normal request processing", func(t *testing.T) {
		req, res := buildRequest("GET", "/test")
		router := chi.NewRouter()
		router.Use(Middleware)
		router.Get("/test", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("OK"))
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusOK, res.Code)
		assert.Equal(t, "OK", res.Body.String())
	})

	t.Run("error response handling", func(t *testing.T) {
		req, res := buildRequest("GET", "/error")
		router := chi.NewRouter()
		router.Use(Middleware)
		router.Get("/error", func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "custom error", http.StatusBadRequest)
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusBadRequest, res.Code)
		assert.Contains(t, res.Body.String(), "custom error")
	})

	t.Run("panic handling", func(t *testing.T) {
		req, res := buildRequest("GET", "/panic")
		router := chi.NewRouter()
		router.Use(Middleware)
		router.Get("/panic", func(w http.ResponseWriter, r *http.Request) {
			panic("unexpected error")
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusInternalServerError, res.Code)
		assert.Contains(t, res.Body.String(), "Internal Server Error")
	})

	t.Run("sql.ErrNoRows handling", func(t *testing.T) {
		req, res := buildRequest("GET", "/notfound")
		router := chi.NewRouter()
		router.Use(Middleware)
		router.Get("/notfound", func(w http.ResponseWriter, r *http.Request) {
			err := sql.ErrNoRows
			status, msg := buildErrorResponse(err)
			http.Error(w, msg, status)
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusNotFound, res.Code)
		assert.Contains(t, res.Body.String(), "Resource not found")
	})

	t.Run("generic internal server error", func(t *testing.T) {
		req, res := buildRequest("GET", "/internalerror")
		router := chi.NewRouter()
		router.Use(Middleware)
		router.Get("/internalerror", func(w http.ResponseWriter, r *http.Request) {
			err := errors.New("some internal issue")
			status, msg := buildErrorResponse(err)
			http.Error(w, msg, status)
		})

		router.ServeHTTP(res, req)
		assert.Equal(t, http.StatusInternalServerError, res.Code)
		assert.Contains(t, res.Body.String(), "Internal Server Error")
	})
}

// buildRequest creates a new test HTTP request
func buildRequest(method, url string) (*http.Request, *httptest.ResponseRecorder) {
	req, _ := http.NewRequest(method, url, nil)
	res := httptest.NewRecorder()
	return req, res
}
