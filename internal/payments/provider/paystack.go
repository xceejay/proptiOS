package psp

type Paystack struct{}

func NewPaystackProvider() *Paystack {
	return &Paystack{}
}

func (p *Paystack) ProcessPayment(amount float64, currency string, userID string) (string, error) {
	// Implement Paystack API logic here
	return "txn_paystack_123", nil
}
