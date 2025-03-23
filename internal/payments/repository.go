package payments

import (
	"errors"

	"github.com/xceejay/api.events.proptios.com/internal/model"
)

// Repository defines the interface for database operations.
type Repository interface {
	SavePayment(payment *model.Payment) error
	GetPaymentByID(id string) (*model.Payment, error)
}

// MockRepository is a simple in-memory implementation.
type MockRepository struct {
	Payments map[string]*model.Payment
}

func NewMockRepository() *MockRepository {
	return &MockRepository{
		Payments: make(map[string]*model.Payment),
	}
}

func (r *MockRepository) SavePayment(payment *model.Payment) error {
	if payment.ID == "" {
		return errors.New("payment ID is required")
	}
	r.Payments[payment.ID] = payment
	return nil
}

func (r *MockRepository) GetPaymentByID(id string) (*model.Payment, error) {
	payment, exists := r.Payments[id]
	if !exists {
		return nil, errors.New("payment not found")
	}
	return payment, nil
}
