package responses

import (
	"encoding/json"
	"net/http"

	"github.com/sirupsen/logrus"
)

// Logger instance
var logger = logrus.New()

// Middleware is a wrapper to format successful API responses consistently.
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rec := &responseRecorder{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(rec, r)

		if rec.statusCode < 200 || rec.statusCode >= 300 {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		response := SuccessResponse{
			Status:  rec.statusCode,
			Message: "Request processed successfully.",
		}

		if rec.body != nil {
			response.Data = rec.body
		}

		if err := json.NewEncoder(w).Encode(response); err != nil {
			logger.Errorf("Failed to encode response: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
	})
}

// responseRecorder is a custom response writer to capture status and body
type responseRecorder struct {
	http.ResponseWriter
	statusCode int
	body       interface{}
}

// WriteHeader captures the status code
func (r *responseRecorder) WriteHeader(statusCode int) {
	r.statusCode = statusCode
	r.ResponseWriter.WriteHeader(statusCode)
}

// Write captures the body and ensures JSON formatting
func (r *responseRecorder) Write(data []byte) (int, error) {
	r.body = json.RawMessage(data)
	return r.ResponseWriter.Write(data)
}
