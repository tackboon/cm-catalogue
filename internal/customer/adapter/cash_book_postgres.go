package adapter

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	customError "github.com/tackboon/cm-catalogue/internal/common/errors"
	customer "github.com/tackboon/cm-catalogue/internal/customer/domain"
)

type CashBookModel struct {
	ID          int
	CustomerID  int
	Date        time.Time
	Type        string
	Amount      float32
	Description *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type CashBookPostgresRepository struct {
	db *pgxpool.Pool
}

func NewCashBookPostgresRepository(client *pgxpool.Pool) CashBookPostgresRepository {
	return CashBookPostgresRepository{
		db: client,
	}
}

func (c CashBookPostgresRepository) CreateCashBookRecord(ctx context.Context, cashbook customer.CashBookRecord) error {
	tx, err := c.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			tx.Rollback(ctx)
		} else {
			tx.Commit(ctx)
		}
	}()

	cashbookStmt := `
		INSERT INTO cash_books (customer_id, date, type, amount, description, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7);
	`

	_, err = tx.Exec(ctx, cashbookStmt,
		cashbook.CustomerID,
		cashbook.Date,
		cashbook.Type,
		cashbook.Amount,
		cashbook.Description,
		cashbook.CreatedAt,
		cashbook.UpdatedAt,
	)

	if err != nil {
		var pgerr *pgconn.PgError
		if errors.As(err, &pgerr) && pgerr.ConstraintName == "cash_books_customer_id_fkey" {
			return customError.NewSlugError("invalid customer id", "invalid-customer-id")
		}
		return err
	}

	var customerStmt string
	if cashbook.Type == customer.Credit {
		customerStmt = `
		UPDATE customers SET total_unbilled_amount = total_unbilled_amount + $1
		WHERE id=$2;  
	`
	} else {
		customerStmt = `
		UPDATE customers SET total_unbilled_amount = total_unbilled_amount - $1
		WHERE id=$2;  
	`
	}

	_, err = tx.Exec(ctx, customerStmt, cashbook.Amount, cashbook.CustomerID)
	if err != nil {
		return err
	}

	return nil
}

func (c CashBookPostgresRepository) DeleteCashBookRecordByID(ctx context.Context, cashBookID int) error {
	tx, err := c.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			tx.Rollback(ctx)
		} else {
			tx.Commit(ctx)
		}
	}()

	var cashbookRecord CashBookModel
	getStmt := `
		SELECT id, customer_id, type, amount
		FROM cash_books WHERE id=$1;
	`
	err = tx.QueryRow(ctx, getStmt, cashBookID).Scan(
		&cashbookRecord.ID,
		&cashbookRecord.CustomerID,
		&cashbookRecord.Type,
		&cashbookRecord.Amount,
	)
	if err != nil {
		return err
	}

	deleteStmt := `
		DELETE FROM cash_books WHERE id=$1;
	`
	_, err = tx.Exec(ctx, deleteStmt, cashBookID)
	if err != nil {
		return err
	}

	var customerStmt string
	if string(cashbookRecord.Type) == string(customer.Credit) {
		customerStmt = `
		UPDATE customers SET total_unbilled_amount = total_unbilled_amount - $1
		WHERE id=$2;  
	`
	} else {
		customerStmt = `
		UPDATE customers SET total_unbilled_amount = total_unbilled_amount + $1
		WHERE id=$2;  
	`
	}
	_, err = tx.Exec(ctx, customerStmt, cashbookRecord.Amount, cashbookRecord.CustomerID)
	if err != nil {
		return err
	}

	return nil
}

func (c CashBookPostgresRepository) GetCashBookRecords(
	ctx context.Context,
	customerID int,
	startAt time.Time,
	endAt time.Time,
) ([]customer.CashBookRecord, error) {
	var appCashbooks []customer.CashBookRecord

	stmt := `
		SELECT id, customer_id, date, type, amount, description, created_at, updated_at 
		FROM cash_books WHERE customer_id=$1 AND date BETWEEN $2 AND $3
		ORDER BY date DESC, id DESC;
	`

	rows, err := c.db.Query(ctx, stmt, customerID, startAt, endAt)
	if err != nil {
		return appCashbooks, err
	}
	defer rows.Close()

	appCashbooks, err = cashBookModelToApp(rows)
	if err != nil {
		return appCashbooks, err
	}

	return appCashbooks, nil
}

func cashBookModelToApp(rows pgx.Rows) ([]customer.CashBookRecord, error) {
	var appCashbook []customer.CashBookRecord

	for rows.Next() {
		var c CashBookModel

		err := rows.Scan(
			&c.ID,
			&c.CustomerID,
			&c.Date,
			&c.Type,
			&c.Amount,
			&c.Description,
			&c.CreatedAt,
			&c.UpdatedAt,
		)

		if err != nil {
			return appCashbook, err
		}

		var ac customer.CashBookRecord

		ac.ID = c.ID
		ac.CustomerID = c.CustomerID
		ac.Date = c.Date
		ac.Amount = c.Amount
		ac.CreatedAt = c.CreatedAt
		ac.UpdatedAt = c.UpdatedAt

		if c.Description != nil {
			ac.Description = *c.Description
		}

		if c.Type == string(customer.Debit) {
			ac.Type = customer.Debit
		} else if c.Type == string(customer.Credit) {
			ac.Type = customer.Credit
		}

		appCashbook = append(appCashbook, ac)
	}

	return appCashbook, nil
}
