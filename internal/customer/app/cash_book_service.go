package app

import (
	"context"
	"time"

	customer "github.com/tackboon97/cm-catalogue/internal/customer/domain"
)

type cashbookRepository interface {
	CreateCashBookRecord(ctx context.Context, cashbook customer.CashBookRecord) error
	GetCashBookRecords(ctx context.Context, customerID int, startAt time.Time, endAt time.Time) ([]customer.CashBookRecord, error)
	DeleteCashBookRecord(ctx context.Context, customerID int, cashBookID int) error
}

type CashBookService struct {
	repo cashbookRepository
}

func NewCashBookService(repo cashbookRepository) CashBookService {
	if repo == nil {
		panic("missing cash book repository.")
	}

	return CashBookService{
		repo: repo,
	}
}

func (c CashBookService) CreateCashBookRecord(ctx context.Context, cashbook customer.CashBookRecord) error {
	if err := cashbook.IsValidType(); err != nil {
		return err
	}

	if err := cashbook.IsValidAmount(); err != nil {
		return err
	}

	if err := cashbook.IsValidDescription(); err != nil {
		return err
	}

	cashbook.CreatedAt = time.Now()
	cashbook.UpdatedAt = time.Now()

	return c.repo.CreateCashBookRecord(ctx, cashbook)
}

func (c CashBookService) GetCashBookRecords(ctx context.Context, customerID int, startAt time.Time, endAt time.Time) ([]customer.CashBookRecord, error) {
	return c.repo.GetCashBookRecords(ctx, customerID, startAt, endAt)
}

func (c CashBookService) DeleteCashBookRecord(ctx context.Context, customerID int, cashBookID int) error {
	return c.repo.DeleteCashBookRecord(ctx, customerID, cashBookID)
}
