package adapter_test

import (
	"context"
	"math/rand"
	"testing"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/tackboon/cm-catalogue/internal/common/driver"
	"github.com/tackboon/cm-catalogue/internal/common/random"
	"github.com/tackboon/cm-catalogue/internal/customer/adapter"
	customer "github.com/tackboon/cm-catalogue/internal/customer/domain"
)

func newCashBookPostgresRepository(t *testing.T, client *pgxpool.Pool) adapter.CashBookPostgresRepository {
	return adapter.NewCashBookPostgresRepository(client)
}

func newCustomer(t *testing.T, repo customer.CustomerRepository) customer.Customer {
	ctx := context.Background()
	c := customer.Customer{
		Code:         "AB001",
		Name:         random.RandomString(50),
		Contact:      "0123456789",
		Relationship: customer.InCooperation,
		Address:      "1/10, Jln 2, Kampung Jambu",
		Postcode:     "59100",
		City:         "Kuala Lumpur",
		State:        "Kuala Lumpur",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	newID, err := repo.CreateNewCustomer(ctx, c)
	require.NoError(t, err)

	c.ID = newID
	return c
}

func TestCashBookRepository(t *testing.T) {
	t.Parallel()
	rand.Seed(time.Now().UTC().UnixNano())

	conn := driver.NewPostgresConnection()
	customerRepo := newCustomerPostgresRepository(t, conn)
	cashBookRepo := newCashBookPostgresRepository(t, conn)

	dummyCustomer := newCustomer(t, customerRepo)

	t.Log("testing create cashbook record")
	testCreateCashBookRecord(t, cashBookRepo, &dummyCustomer)
	assertTotalUnbilledAmount(t, customerRepo, &dummyCustomer)

	t.Log("testing search cashbook record")
	records := testSearchCashBookRecord(t, cashBookRepo, &dummyCustomer)
	assert.True(t, len(records) == 2, "failed to search correct cashbook records")

	t.Log("testing update cashbook record")
	testDeleteCashBookRecord(t, cashBookRepo, records, &dummyCustomer)
	assertTotalUnbilledAmount(t, customerRepo, &dummyCustomer)
}

func testCreateCashBookRecord(t *testing.T, repo customer.CashbookRepository, c *customer.Customer) {
	t.Helper()
	ctx := context.Background()

	testCases := []struct {
		Name       string
		AddRecord  func(*testing.T) customer.CashBookRecord
		RequireErr bool
	}{
		{
			Name: "Credit",
			AddRecord: func(t *testing.T) customer.CashBookRecord {
				date, err := time.Parse("2006-01-02", "2022-11-15")
				require.NoError(t, err)

				amount := float32(20.5)
				cashbook := customer.CashBookRecord{
					CustomerID:  c.ID,
					Date:        date,
					Type:        customer.Credit,
					Amount:      amount,
					Description: "create_cashbook_record_test__credit",
					CreatedAt:   time.Now(),
					UpdatedAt:   time.Now(),
				}

				c.TotalUnbilledAmount += amount

				return cashbook
			},
			RequireErr: false,
		},
		{
			Name: "Debit",
			AddRecord: func(t *testing.T) customer.CashBookRecord {
				date, err := time.Parse("2006-01-02", "2022-11-15")
				require.NoError(t, err)

				amount := float32(10.2)
				cashbook := customer.CashBookRecord{
					CustomerID:  c.ID,
					Date:        date,
					Type:        customer.Debit,
					Amount:      amount,
					Description: "create_cashbook_record_test__debit",
					CreatedAt:   time.Now(),
					UpdatedAt:   time.Now(),
				}

				c.TotalUnbilledAmount -= amount

				return cashbook
			},
			RequireErr: false,
		},
		{
			Name: "Rollback",
			AddRecord: func(t *testing.T) customer.CashBookRecord {
				date, err := time.Parse("2006-01-02", "2022-11-15")
				require.NoError(t, err)

				amount := float32(10.2)
				cashbook := customer.CashBookRecord{
					CustomerID:  -1,
					Date:        date,
					Type:        customer.Debit,
					Amount:      amount,
					Description: "create_cashbook_record_test__debit",
					CreatedAt:   time.Now(),
					UpdatedAt:   time.Now(),
				}

				return cashbook
			},
			RequireErr: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			cashbook := tc.AddRecord(t)
			err := repo.CreateCashBookRecord(ctx, cashbook)

			if tc.RequireErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
			}

		})
	}
}

func testSearchCashBookRecord(t *testing.T, repo customer.CashbookRepository, c *customer.Customer) []customer.CashBookRecord {
	t.Helper()
	ctx := context.Background()
	startAt, err := time.Parse("2006-01-02", "2022-11-15")
	require.NoError(t, err)

	endAt, err := time.Parse("2006-01-02", "2022-11-16")
	require.NoError(t, err)

	records, err := repo.GetCashBookRecords(ctx, c.ID, startAt, endAt)
	require.NoError(t, err)

	return records
}

func testDeleteCashBookRecord(t *testing.T, repo customer.CashbookRepository, crs []customer.CashBookRecord, c *customer.Customer) {
	t.Helper()
	ctx := context.Background()
	var creditCR customer.CashBookRecord
	var debitCR customer.CashBookRecord

	for _, cr := range crs {
		if cr.Type == customer.Credit {
			creditCR = cr
		} else if cr.Type == customer.Debit {
			debitCR = cr
		}
	}

	testCases := []struct {
		Name         string
		DeleteRecord func(*testing.T) customer.CashBookRecord
		RequireErr   bool
	}{
		{
			Name: "Credit",
			DeleteRecord: func(t *testing.T) customer.CashBookRecord {
				c.TotalUnbilledAmount -= creditCR.Amount
				return creditCR
			},
			RequireErr: false,
		},
		{
			Name: "Debit",
			DeleteRecord: func(t *testing.T) customer.CashBookRecord {
				c.TotalUnbilledAmount += debitCR.Amount
				return debitCR
			},
			RequireErr: false,
		},
		{
			Name: "Rollback",
			DeleteRecord: func(t *testing.T) customer.CashBookRecord {
				return creditCR
			},
			RequireErr: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			cashbook := tc.DeleteRecord(t)
			err := repo.DeleteCashBookRecordByID(ctx, cashbook.ID)

			if tc.RequireErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
			}

			records := testSearchCashBookRecord(t, repo, c)
			for _, r := range records {
				assert.True(t, r.ID != cashbook.ID)
			}
		})
	}
}

func assertTotalUnbilledAmount(t *testing.T, repo customer.CustomerRepository, c *customer.Customer) {
	ctx := context.Background()
	res, err := repo.GetCustomerByID(ctx, c.ID)
	require.NoError(t, err)

	assert.True(t, res.TotalUnbilledAmount == c.TotalUnbilledAmount, "total unbilled amount not match")
}
