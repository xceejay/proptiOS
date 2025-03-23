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
			http.Error(w, errors.BadRequest("Invalid request").Error(), http.StatusBadRequest)
			return
		}

		token, err := service.Login(r.Context(), req.Username, req.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"token": token})
	}
}
