package app

import (
	"context"
	"time"

	customer "github.com/tackboon/cm-catalogue/internal/customer/domain"
)

type CashBookService struct {
	repo customer.CashbookRepository
}

func NewCashBookService(repo customer.CashbookRepository) CashBookService {
	if repo == nil {
		panic("missing cash book repository.")
	}

	return CashBookService{
		repo: repo,
	}
}

func (c CashBookService) CreateCashBookRecord(ctx context.Context, cashbook customer.CashBookRecord) error {
	if err := cashbook.IsValidAmount(); err != nil {
		return err
	}

	if err := cashbook.IsValidType(); err != nil {
		return err
	}

	if err := cashbook.IsValidDescription(); err != nil {
		return err
	}

	now := time.Now()
	cashbook.CreatedAt = now
	cashbook.UpdatedAt = now

	return c.repo.CreateCashBookRecord(ctx, cashbook)
}

func (c CashBookService) DeleteCashBookRecord(ctx context.Context, cashBookID int) error {
	return c.repo.DeleteCashBookRecordByID(ctx, cashBookID)
}

func (c CashBookService) GetCashBookRecords(ctx context.Context, customerID int, startAt time.Time, endAt time.Time) ([]customer.CashBookRecord, error) {
	return c.repo.GetCashBookRecords(ctx, customerID, startAt, endAt)
}
