package adapter

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	customError "github.com/tackboon97/cm-catalogue/internal/common/errors"
	customer "github.com/tackboon97/cm-catalogue/internal/customer/domain"
)

type CustomerModel struct {
	ID                  int
	Code                *string
	Name                string
	Contact             *string
	Relationship        string
	Address             *string
	Postcode            *string
	City                *string
	State               *string
	TotalUnbilledAmount float32
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

type CustomerPostgresRepository struct {
	db *pgxpool.Pool
}

func NewCustomerPostgresRepository(client *pgxpool.Pool) CustomerPostgresRepository {
	return CustomerPostgresRepository{
		db: client,
	}
}

func (c CustomerPostgresRepository) CreateNewCustomer(ctx context.Context, customer customer.Customer) (newID int, err error) {
	stmt := `
		INSERT INTO customers (code, name, contact, relationship, 
			address, postcode, city, state, 
			total_unbilled_amount, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;
	`

	err = c.db.QueryRow(ctx, stmt,
		customer.Code,
		customer.Name,
		customer.Contact,
		customer.Relationship,
		customer.Address,
		customer.Postcode,
		customer.City,
		customer.State,
		customer.TotalUnbilledAmount,
		customer.CreatedAt,
		customer.UpdatedAt,
	).Scan(&newID)

	if err != nil {
		var pgerr *pgconn.PgError
		if errors.As(err, &pgerr) && pgerr.ConstraintName == "customers_name_key" {
			return 0, customError.NewSlugError("customer name must be unique", "customer-name-existed")
		}
		return 0, err
	}

	return newID, nil
}

func (c CustomerPostgresRepository) UpdateCustomer(ctx context.Context, customer customer.Customer) error {
	stmt := `
		UPDATE customers SET code=$2, name=$3, contact=$4, relationship=$5, 
			address=$6, postcode=$7, city=$8, state=$9, updated_at=$10 
		WHERE id=$1;
	`

	_, err := c.db.Exec(ctx, stmt,
		customer.ID,
		customer.Code,
		customer.Name,
		customer.Contact,
		customer.Relationship,
		customer.Address,
		customer.Postcode,
		customer.City,
		customer.State,
		customer.UpdatedAt,
	)

	if err != nil {
		var pgerr *pgconn.PgError
		if errors.As(err, &pgerr) && pgerr.ConstraintName == "customers_name_key" {
			return customError.NewSlugError("customer name already existed", "customer-name-existed")
		}
		return err
	}

	return nil
}

func (c CustomerPostgresRepository) GetAllCustomers(ctx context.Context, page int, limit int, filter string, relationshipFilter customer.RelationshipFilter) ([]customer.Customer, customer.Pagination, error) {
	var appCustomers []customer.Customer
	var pagination customer.Pagination
	var relationshipFilterQuery string
	var rows pgx.Rows
	var err error

	offset := (page - 1) * limit

	if relationshipFilter == customer.InCooperationFilter {
		relationshipFilterQuery = "relationship IN ('in_cooperation') "
	} else if relationshipFilter == customer.SuspendedFilter {
		relationshipFilterQuery = "relationship IN ('suspended') "
	} else {
		relationshipFilterQuery = "relationship IN ('in_cooperation', 'suspended') "
	}

	if filter == "" {
		stmt := `SELECT id, code, name, contact, relationship, address, postcode, city, state,
				total_unbilled_amount, created_at, updated_at
				FROM customers WHERE ` + relationshipFilterQuery + `
				ORDER BY name OFFSET $1 LIMIT $2;`

		rows, err = c.db.Query(ctx, stmt, offset, limit)
		if err != nil {
			return appCustomers, pagination, err
		}
		defer rows.Close()

		pageStmt := "SELECT COUNT(*) FROM customers WHERE " + relationshipFilterQuery

		err = c.db.QueryRow(ctx, pageStmt).Scan(&pagination.TotalCount)
		if err != nil {
			return appCustomers, pagination, err
		}
	} else {
		stmt := `SELECT id, code, name, contact, relationship, address, postcode, city, state,
				total_unbilled_amount, created_at, updated_at
				FROM customers WHERE ` + relationshipFilterQuery + `
				AND tsvector_document @@ plainto_tsquery($1)
				ORDER BY ts_rank(tsvector_document, plainto_tsquery($1)) DESC
				OFFSET $2 LIMIT $3;`

		rows, err = c.db.Query(ctx, stmt, filter, offset, limit)
		if err != nil {
			return appCustomers, pagination, err
		}
		defer rows.Close()

		pageStmt := `SELECT COUNT(*) FROM customers WHERE ` + relationshipFilterQuery + `
				AND tsvector_document @@ plainto_tsquery($1);`

		err = c.db.QueryRow(ctx, pageStmt, filter).Scan(&pagination.TotalCount)
		if err != nil {
			return appCustomers, pagination, err
		}
	}

	appCustomers, err = customerModelToApp(rows)
	if err != nil {
		return appCustomers, pagination, err
	}

	pagination.Count = len(appCustomers)
	pagination.Page = page

	return appCustomers, pagination, nil
}

func (c CustomerPostgresRepository) GetCustomerByID(ctx context.Context, customerID int) (customer.Customer, error) {
	var appCustomer customer.Customer

	stmt := `
		SELECT id, code, name, contact, relationship, address, postcode, city, state,
			total_unbilled_amount, created_at, updated_at
		FROM customers WHERE id=$1;
	`

	rows, err := c.db.Query(ctx, stmt, customerID)
	if err != nil {
		return appCustomer, err
	}
	defer rows.Close()

	appCustomers, err := customerModelToApp(rows)
	if err != nil {
		return appCustomer, err
	}

	if len(appCustomers) == 0 {
		return appCustomer, customError.NewSlugError("No record found", "no-record-found")
	}
	appCustomer = appCustomers[0]

	return appCustomer, nil
}

func (c CustomerPostgresRepository) DeleteCustomerByID(ctx context.Context, customerID int) error {
	stmt := `
		DELETE FROM customers WHERE id=$1;
	`

	_, err := c.db.Exec(ctx, stmt, customerID)
	if err != nil {
		return err
	}

	return nil
}

func customerModelToApp(rows pgx.Rows) ([]customer.Customer, error) {
	var appCustomers []customer.Customer

	for rows.Next() {
		var c CustomerModel

		err := rows.Scan(
			&c.ID,
			&c.Code,
			&c.Name,
			&c.Contact,
			&c.Relationship,
			&c.Address,
			&c.Postcode,
			&c.City,
			&c.State,
			&c.TotalUnbilledAmount,
			&c.CreatedAt,
			&c.UpdatedAt,
		)

		if err != nil {
			return appCustomers, err
		}

		var ac customer.Customer

		ac.ID = c.ID
		ac.Code = c.Code
		ac.Name = c.Name
		ac.Contact = c.Contact
		ac.Address = c.Address
		ac.Postcode = c.Postcode
		ac.City = c.City
		ac.State = c.State
		ac.TotalUnbilledAmount = c.TotalUnbilledAmount
		ac.CreatedAt = c.CreatedAt
		ac.UpdatedAt = c.UpdatedAt

		if c.Relationship == string(customer.Suspended) {
			ac.Relationship = customer.Suspended
		} else {
			ac.Relationship = customer.InCooperation
		}

		appCustomers = append(appCustomers, ac)
	}

	return appCustomers, nil
}
