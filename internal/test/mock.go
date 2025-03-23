package test

import (
	"io"
	"net/http"
	"net/http/httptest"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/xceejay/api.events.proptios.com/internal/errors"
	"github.com/xceejay/api.events.proptios.com/pkg/accesslog"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

// MockRequest creates an *http.Request and *httptest.ResponseRecorder for testing handlers.
func MockRequest(method, url string, body io.Reader) (*http.Request, *httptest.ResponseRecorder) {
	req := httptest.NewRequest(method, url, body)
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()
	return req, res
}

// MockRouter creates a *mux.Router for testing APIs with required middleware.
func MockRouter(logger log.Logger) *mux.Router {
	router := mux.NewRouter()

	// Apply middleware
	router.Use(
		accesslog.Middleware(logger),
		errors.Middleware,
		cors.AllowAll().Handler,
	)

	return router
}
