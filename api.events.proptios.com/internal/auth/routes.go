package auth

import (
	"github.com/go-chi/chi/v5"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

func RegisterHandlers(r chi.Router, service Service, logger log.Logger) {
	r.Post("/login", LoginHandler(service, logger))
}
