package accesslog

import (
	"net/http"
	"time"

	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

// LogResponseWriter wraps http.ResponseWriter to capture status code and bytes written.
type LogResponseWriter struct {
	http.ResponseWriter
	Status       int
	BytesWritten int
}

func (w *LogResponseWriter) WriteHeader(statusCode int) {
	w.Status = statusCode
	w.ResponseWriter.WriteHeader(statusCode)
}

func (w *LogResponseWriter) Write(b []byte) (int, error) {
	n, err := w.ResponseWriter.Write(b)
	w.BytesWritten += n
	return n, err
}

// Middleware returns a mux-compatible middleware that logs every HTTP request.
func Middleware(logger log.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// Wrap response writer to capture status and bytes written
			lrw := &LogResponseWriter{ResponseWriter: w, Status: http.StatusOK}

			// Associate request ID and session ID with the context
			ctx := log.WithRequest(r.Context(), r)
			r = r.WithContext(ctx)

			// Call the next handler
			next.ServeHTTP(lrw, r)

			// Log the request details
			logger.With(ctx, "duration", time.Since(start).Milliseconds(), "status", lrw.Status).
				Infof("%s %s %s %d %d", r.Method, r.URL.Path, r.Proto, lrw.Status, lrw.BytesWritten)
		})
	}
}
