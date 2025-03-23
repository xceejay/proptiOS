package payments

import (
	"errors"

	"github.com/xceejay/api.events.proptios.com/internal/model"
	psp "github.com/xceejay/api.events.proptios.com/internal/payments/provider"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

type Service struct {
	Repo          Repository
	PSPs          map[string]PSP
	KafkaProducer *KafkaProducer
}

func NewService(repo Repository, producer *KafkaProducer) *Service {

	if producer == nil {
		panic("KafkaProducer is not initialized")
	}

	service := &Service{
		Repo:          repo,
		PSPs:          make(map[string]PSP),
		KafkaProducer: producer,
	}

	// Register payment providers
	service.PSPs["paystack"] = psp.NewPaystackProvider()
	service.PSPs["pawapay"] = psp.NewPawapayProvider()
	service.PSPs["stripe"] = psp.NewStripeProvider()

	return service
}

func (s *Service) ProcessPayment(userID, provider string, amount float64, currency string) (string, error) {
	logger := log.New() // Use the default logger

	psp, exists := s.PSPs[provider]
	if !exists {
		logger.Error("Unsupported payment provider:", provider)
		return "", errors.New("unsupported payment provider")
	}

	logger.Infof("Using PSP: %T", psp)

	transactionID, err := psp.ProcessPayment(amount, currency, userID)
	if err != nil {
		logger.Error("Payment processing failed:", err)
		return "", err
	}

	payment := &model.Payment{
		ID:            transactionID,
		UserID:        userID,
		Amount:        amount,
		Currency:      currency,
		Provider:      provider,
		Status:        "pending",
		TransactionID: transactionID,
	}

	err = s.Repo.SavePayment(payment)
	if err != nil {
		logger.Error("Failed to save payment:", err)
		return "", err
	}

	// Ensure KafkaProducer is initialized before publishing
	if s.KafkaProducer == nil {
		logger.Error("KafkaProducer is nil, cannot publish event")
		return "", errors.New("internal error: messaging service unavailable")
	}

	err = s.KafkaProducer.Publish(transactionID) // Fix: Send only transactionID
	if err != nil {
		logger.Error("Failed to publish Kafka message:", err)
		return "", err
	}

	return transactionID, nil
}
