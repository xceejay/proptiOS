package psp

type Stripe struct{}

func NewStripeProvider() *Stripe {
	return &Stripe{}
}

func (s *Stripe) ProcessPayment(amount float64, currency string, userID string) (string, error) {
	return "txn_stripe_789", nil
}
