package psp

// PSP defines the interface for all payment providers.
type PSP interface {
	ProcessPayment(amount float64, currency string, userID string) (string, error)
	ValidateTransaction(transactionID string) (bool, error)
}
