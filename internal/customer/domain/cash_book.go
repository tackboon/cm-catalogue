package customer

import (
	"time"

	"github.com/tackboon/cm-catalogue/internal/common/errors"
)

type CashBookType string

const (
	Credit CashBookType = "credit"
	Debit  CashBookType = "debit"
)

type CashBookRecord struct {
	ID          int
	CustomerID  int
	Date        time.Time
	Type        CashBookType
	Amount      float32
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (c CashBookRecord) IsValidAmount() error {
	if c.Amount <= 0 || c.Amount > 1000000 {
		return errors.NewIncorrectInputError("invalid cash book amount.", "invalid-amount")
	}
	return nil
}

func (c CashBookRecord) IsValidType() error {
	if c.Type != Credit && c.Type != Debit {
		return errors.NewIncorrectInputError("invalid cash book record type", "invalid-type")
	}
	return nil
}

func (c CashBookRecord) IsValidDescription() error {
	if len(c.Description) > 50 {
		return errors.NewIncorrectInputError(
			"maximum length for cash book description is 50 characters",
			"invalid-description",
		)
	}
	return nil
}
