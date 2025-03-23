package psp

type PawaPay struct{}

func NewPawapayProvider() *PawaPay {
	return &PawaPay{}
}

func (p *PawaPay) ProcessPayment(amount float64, currency string, userID string) (string, error) {
	return "txn_pawapay_456", nil
}
