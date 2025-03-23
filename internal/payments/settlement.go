package payments

import (
	"errors"
)

type SettlementService struct {
	Repo Repository
}

func NewSettlementService(repo Repository) *SettlementService {
	return &SettlementService{Repo: repo}
}

func (s *SettlementService) DistributePayment(paymentID string) error {
	payment, err := s.Repo.GetPaymentByID(paymentID)
	if err != nil {
		return err
	}

	if payment.Status != "completed" {
		return errors.New("payment not completed")
	}

	// Logic for splitting rent payments between stakeholders.

	return nil
}
