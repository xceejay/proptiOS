package auth

import (
	"encoding/json"
	"net/http"

	"github.com/xceejay/api.events.proptios.com/internal/errors"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

// LoginHandler handles user login requests.
func LoginHandler(service Service, logger log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			logger.With(r.Context()).Errorf("invalid request: %v", err)
			errResp := errors.BadRequest("Invalid request payload")
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(errResp.Status)
			json.NewEncoder(w).Encode(errResp)
			return
		}

		token, err := service.Login(r.Context(), req.Username, req.Password)
		if err != nil {
			logger.With(r.Context()).Errorf("login failed: %v", err)
			errResp := errors.Unauthorized("Invalid username or password")
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(errResp.Status)
			json.NewEncoder(w).Encode(errResp)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"token": token})
	}
}
