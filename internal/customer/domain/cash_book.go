package customer

import (
	"time"

	"github.com/tackboon97/cm-catalogue/internal/common/errors"
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
	Description *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (c CashBookRecord) IsValidType() error {
	if c.Type != "credit" && c.Type != "debit" {
		return errors.NewIncorrectInputError("type can only be 'credit' or 'debit'.", "invalid-type")
	}

	return nil
}

func (c CashBookRecord) IsValidAmount() error {
	if c.Amount <= 0 || c.Amount > 1000000 {
		return errors.NewIncorrectInputError("invalid amount.", "invalid-amount")
	}

	return nil
}

func (c CashBookRecord) IsValidDescription() error {
	if c.Description != nil && len(*c.Description) > 50 {
		return errors.NewIncorrectInputError("maximum length for description is 50 characters", "invalid-description")
	}

	return nil
}
