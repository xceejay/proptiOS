package payments

import (
	"github.com/segmentio/kafka-go"
)

type PSP interface {
	ProcessPayment(amount float64, currency, userID string) (string, error)
}

// PaymentService is the main struct that wires all components together.
type PaymentService struct {
	Repo   Repository
	PSPs   map[string]PSP
	Events *kafka.Writer
}

// NewPaymentService initializes the payment module.
func NewPaymentService(repo Repository, events *kafka.Writer) *PaymentService {
	return &PaymentService{
		Repo:   repo,
		PSPs:   make(map[string]PSP),
		Events: events,
	}
}

// RegisterPSP allows adding new payment providers dynamically.
func (s *PaymentService) RegisterPSP(name string, provider PSP) {
	s.PSPs[name] = provider
}
