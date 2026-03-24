package auth

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestCurrentUser(t *testing.T) {
	ctx := context.Background()
	assert.Nil(t, CurrentUser(ctx))

	ctx = WithUser(ctx, "100", "test")
	identity := CurrentUser(ctx)
	if assert.NotNil(t, identity) {
		assert.Equal(t, "100", identity.GetID())
		assert.Equal(t, "test", identity.GetName())
	}
}

// func Test_handleToken(t *testing.T) {
// 	req := httptest.NewRequest("GET", "http://example.com", nil)
// 	assert.Nil(t, CurrentUser(req.Context()))

// 	// manually inject claims into token and call handleToken
// 	token := &jwt.Token{
// 		Claims: jwt.MapClaims{
// 			"id":   "100",
// 			"name": "test",
// 		},
// 		Valid: true,
// 	}

// 	err := handleToken(req, token)
// 	assert.Nil(t, err)

// 	// handleToken does not modify context directly in this setup
// 	// Normally you'd use middleware to inject the claims into context
// }

func TestMockAuthMiddleware(t *testing.T) {
	req := httptest.NewRequest("GET", "http://example.com", nil)
	req.Header = MockAuthHeader()
	res := httptest.NewRecorder()

	handler := MockAuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := CurrentUser(r.Context())
		assert.NotNil(t, user)
		assert.Equal(t, "100", user.GetID())
		assert.Equal(t, "Tester", user.GetName())
		w.WriteHeader(http.StatusOK)
	}))

	handler.ServeHTTP(res, req)
	assert.Equal(t, http.StatusOK, res.Code)
}

func TestMockAuthMiddleware_Unauthorized(t *testing.T) {
	req := httptest.NewRequest("GET", "http://example.com", nil) // No auth header
	res := httptest.NewRecorder()

	handler := MockAuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Error("This should not be called")
	}))

	handler.ServeHTTP(res, req)
	assert.Equal(t, http.StatusUnauthorized, res.Code)
	assert.Contains(t, res.Body.String(), "Unauthorized")
}

func TestJWTMiddleware(t *testing.T) {
	// Create a signed token
	key := []byte("secret")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   "123",
		"name": "Tester",
	})
	signedToken, err := token.SignedString(key)
	assert.Nil(t, err)

	req := httptest.NewRequest("GET", "http://example.com", nil)
	req.Header.Set("Authorization", "Bearer "+signedToken)
	res := httptest.NewRecorder()

	handler := JWTMiddleware(string(key))(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := CurrentUser(r.Context())
		assert.NotNil(t, user)
		assert.Equal(t, "123", user.GetID())
		assert.Equal(t, "Tester", user.GetName())
		w.WriteHeader(http.StatusOK)
	}))

	handler.ServeHTTP(res, req)
	assert.Equal(t, http.StatusOK, res.Code)
}

func TestJWTMiddleware_InvalidToken(t *testing.T) {
	req := httptest.NewRequest("GET", "http://example.com", nil)
	req.Header.Set("Authorization", "Bearer invalid.token.here")
	res := httptest.NewRecorder()

	handler := JWTMiddleware("secret")(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Error("This should not be called")
	}))

	handler.ServeHTTP(res, req)
	assert.Equal(t, http.StatusUnauthorized, res.Code)
	assert.Contains(t, res.Body.String(), "Invalid token")
}
