package accesslog

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

func TestMiddleware(t *testing.T) {
	logger, entries := log.NewForTest()

	// Create test router with middleware
	router := chi.NewRouter()
	router.Use(Middleware(logger))

	// Define a test route
	router.Get("/users", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Create test request
	req, _ := http.NewRequest("GET", "/users", nil)
	res := httptest.NewRecorder()

	// Serve request
	router.ServeHTTP(res, req)

	// Assertions
	assert.Equal(t, http.StatusOK, res.Code, "Expected HTTP 200 response")
	assert.Equal(t, 1, entries.Len(), "Expected one log entry")
	assert.Contains(t, entries.All()[0].Message, "GET /users HTTP", "Expected log entry to match request format")
}
