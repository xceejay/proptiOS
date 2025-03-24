package payments

import (
	"encoding/json"
	"log"
	"net/http"
)

type Handler struct {
	Service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{Service: service}
}

func (h *Handler) DepositsPaymentHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID        string  `json:"user_id"`
		Provider      string  `json:"provider"`
		Amount        float64 `json:"amount"`
		Currency      string  `json:"currency"`
		PaymentMethod string  `json:"payment_method"`
		MSISDN        string  `json:"msisdn,omitempty"`
		Description   string  `json:"description"`
	}

	// Debug: Log the incoming request
	log.Println("Received payment request")

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println("Error decoding request:", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Debug: Log parsed data
	log.Printf("Processing payment for User: %s, Provider: %s, Amount: %.2f %s\n", req.UserID, req.Provider, req.Amount, req.Currency)

	transactionID, err := h.Service.ProcessPayment(req.UserID, req.Provider, req.Amount, req.Currency)
	if err != nil {
		log.Println("Error processing payment:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Debug: Successful transaction
	log.Printf("Payment successful. Transaction ID: %s\n", transactionID)

	resp := map[string]string{"transaction_id": transactionID}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func (h *Handler) PayoutsPaymentHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID        string  `json:"user_id"`
		Provider      string  `json:"provider"`
		Amount        float64 `json:"amount"`
		Currency      string  `json:"currency"`
		PaymentMethod string  `json:"payment_method"`
		MSISDN        string  `json:"msisdn,omitempty"`
		Description   string  `json:"description"`
	}

	// Debug: Log the incoming request
	log.Println("Received payment request")

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println("Error decoding request:", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Debug: Log parsed data
	log.Printf("Processing payment for User: %s, Provider: %s, Amount: %.2f %s\n", req.UserID, req.Provider, req.Amount, req.Currency)

	transactionID, err := h.Service.ProcessPayment(req.UserID, req.Provider, req.Amount, req.Currency)
	if err != nil {
		log.Println("Error processing payment:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Debug: Successful transaction
	log.Printf("Payment successful. Transaction ID: %s\n", transactionID)

	resp := map[string]string{"transaction_id": transactionID}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}
