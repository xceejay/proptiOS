package auth

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/xceejay/api.events.proptios.com/internal/errors"
	"github.com/xceejay/api.events.proptios.com/internal/model"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

// Service encapsulates the authentication logic.
type Service interface {
	// Login authenticates a user using username and password.
	// It returns a JWT token if authentication succeeds. Otherwise, an error is returned.
	Login(ctx context.Context, username, password string) (string, error)
}

// Identity represents an authenticated user identity.
type Identity interface {
	// GetID returns the user ID.
	GetID() string
	// GetName returns the user name.
	GetName() string
}

type service struct {
	signingKey      string
	tokenExpiration int
	logger          log.Logger
}

// NewService creates a new authentication service.
func NewService(signingKey string, tokenExpiration int, logger log.Logger) Service {
	return service{signingKey, tokenExpiration, logger}
}

// Login authenticates a user and generates a JWT token if authentication succeeds.
// Otherwise, an error is returned.
func (s service) Login(ctx context.Context, username, password string) (string, error) {
	if identity := s.authenticate(ctx, username, password); identity != nil {
		return s.generateJWT(identity)
	}
	return "", errors.Unauthorized("")
}

// authenticate verifies the username and password.
// If they are correct, it returns an identity. Otherwise, it returns nil.
func (s service) authenticate(ctx context.Context, username, password string) Identity {
	logger := s.logger.With(ctx, "user", username)

	// TODO: This authentication logic is only for demo purposes
	if username == "demo" && password == "pass" {
		logger.Infof("Authentication successful")
		return model.User{ID: "100", Name: "demo"}
	}

	logger.Infof("Authentication failed")
	return nil
}

// generateJWT creates a signed JWT token for an authenticated user.
func (s service) generateJWT(identity Identity) (string, error) {
	claims := jwt.MapClaims{
		"id":   identity.GetID(),
		"name": identity.GetName(),
		"exp":  time.Now().Add(time.Duration(s.tokenExpiration) * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.signingKey))
}
