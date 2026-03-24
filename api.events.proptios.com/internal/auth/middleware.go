package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/xceejay/api.events.proptios.com/internal/model"
)

type contextKey int

const userKey contextKey = iota

// JWTMiddleware returns a JWT-based authentication middleware for Chi.
func JWTMiddleware(verificationKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
				return
			}

			// Expecting "Bearer <token>"
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				http.Error(w, "Invalid Authorization format", http.StatusUnauthorized)
				return
			}

			// Parse the JWT token
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(verificationKey), nil
			})

			if err != nil || !token.Valid {
				http.Error(w, "Invalid token", http.StatusUnauthorized)
				return
			}

			// Extract claims and store in context
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, "Invalid token claims", http.StatusUnauthorized)
				return
			}

			userID, _ := claims["id"].(string)
			userName, _ := claims["name"].(string)

			ctx := WithUser(r.Context(), userID, userName)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// WithUser stores user identity in the request context.
func WithUser(ctx context.Context, id, name string) context.Context {
	return context.WithValue(ctx, userKey, model.User{ID: id, Name: name})
}

// CurrentUser retrieves user identity from the request context.
func CurrentUser(ctx context.Context) *model.User {
	if user, ok := ctx.Value(userKey).(model.User); ok {
		return &user
	}
	return nil
}

// MockAuthMiddleware creates a mock authentication middleware for testing purposes.
func MockAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "TEST" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := WithUser(r.Context(), "100", "Tester")
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// MockAuthHeader returns an HTTP header for testing authentication.
func MockAuthHeader() http.Header {
	header := http.Header{}
	header.Add("Authorization", "TEST")
	return header
}
