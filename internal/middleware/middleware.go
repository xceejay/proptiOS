package middleware

import (
	"fmt"
	"net/http"
)

// Middleware function that prints a placeholder message
func PrintlnMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Middleware placeholder: Request received")
		next.ServeHTTP(w, r) // Call the next handler in the chain
	})
}
