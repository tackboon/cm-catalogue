package customer

import (
	"context"
	"time"
)

type CustomerRepository interface {
	CreateNewCustomer(ctx context.Context, customer Customer) (newID int, err error)
	UpdateCustomerByID(ctx context.Context, customer Customer) error
	DeleteCustomerByID(ctx context.Context, customerID int) error
	GetCustomerByID(ctx context.Context, customerID int) (Customer, error)
	GetAllCustomers(ctx context.Context, page int, limit int, filter string, relationshipFilter RelationshipFilter) ([]Customer, Pagination, error)
}

type CashbookRepository interface {
	CreateCashBookRecord(ctx context.Context, cashbook CashBookRecord) error
	DeleteCashBookRecordByID(ctx context.Context, cashBookID int) error
	GetCashBookRecords(ctx context.Context, customerID int, startAt time.Time, endAt time.Time) ([]CashBookRecord, error)
}
