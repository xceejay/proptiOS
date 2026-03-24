package payments

import (
	"github.com/go-chi/chi/v5"
)

func RegisterHandlers(r chi.Router, h *Handler) {
	r.Route("/", func(r chi.Router) {
		r.Post("/deposits", h.DepositsPaymentHandler) // POST /payments

		r.Post("/payouts", h.DepositsPaymentHandler) // POST /payments

	})
}
