package app

import (
	"context"
	"strings"
	"time"

	"github.com/tackboon97/cm-catalogue/internal/common/errors"
	customer "github.com/tackboon97/cm-catalogue/internal/customer/domain"
)

type customerRepository interface {
	CreateNewCustomer(ctx context.Context, customer customer.Customer) (newID int, err error)
	UpdateCustomer(ctx context.Context, customer customer.Customer) error
	GetAllCustomers(ctx context.Context, page int, limit int, filter string, relationshipFilter customer.RelationshipFilter) ([]customer.Customer, customer.Pagination, error)
	GetCustomerByID(ctx context.Context, customerID int) (customer.Customer, error)
	DeleteCustomerByID(ctx context.Context, customerID int) error
}

type CustomerService struct {
	repo customerRepository
}

func NewCustomerService(repo customerRepository) CustomerService {
	if repo == nil {
		panic("missing customer repository.")
	}

	return CustomerService{
		repo: repo,
	}
}

func (c CustomerService) CreateCustomer(ctx context.Context, customer customer.Customer) (newID int, err error) {
	customer.Name = strings.Trim(customer.Name, " ")

	err = customerPostChecking(customer)
	if err != nil {
		return 0, err
	}

	customerDataToUpper(&customer)

	customer.TotalUnbilledAmount = 0
	customer.CreatedAt = time.Now()
	customer.UpdatedAt = time.Now()

	return c.repo.CreateNewCustomer(ctx, customer)
}

func (c CustomerService) UpdateCustomer(ctx context.Context, customer customer.Customer) error {
	customer.Name = strings.Trim(customer.Name, " ")

	err := customerPostChecking(customer)
	if err != nil {
		return err
	}

	customerDataToUpper(&customer)

	customer.UpdatedAt = time.Now()

	return c.repo.UpdateCustomer(ctx, customer)
}

func (c CustomerService) GetAllCustomers(ctx context.Context, page int, limit int, filter string, relationshipFilter customer.RelationshipFilter) ([]customer.Customer, customer.Pagination, error) {
	var customers []customer.Customer
	var pagination customer.Pagination

	if page <= 0 {
		page = 1
	}

	if limit > 50 {
		return customers, pagination, errors.NewSlugError("limit cannot exceed 50", "limit-too-large")
	} else if limit == 0 {
		limit = 20
	}

	if len(filter) > 20 {
		return customers, pagination, errors.NewSlugError("filter cannot exceed 20 characters", "filter-too-long")
	}

	return c.repo.GetAllCustomers(ctx, page, limit, filter, relationshipFilter)
}

func (c CustomerService) GetCustomerByID(ctx context.Context, customerID int) (customer.Customer, error) {
	return c.repo.GetCustomerByID(ctx, customerID)
}

func (c CustomerService) DeleteCustomerByID(ctx context.Context, customerID int) error {
	return c.repo.DeleteCustomerByID(ctx, customerID)
}

func customerPostChecking(customer customer.Customer) (err error) {
	if err = customer.IsValidCode(); err != nil {
		return err
	}

	if err = customer.IsValidName(); err != nil {
		return err
	}

	if err = customer.IsValidContact(); err != nil {
		return err
	}

	if err = customer.IsValidAddress(); err != nil {
		return err
	}

	if err = customer.IsValidPostcode(); err != nil {
		return err
	}

	if err = customer.IsValidCity(); err != nil {
		return err
	}

	if err = customer.IsValidState(); err != nil {
		return err
	}

	return nil
}

func customerDataToUpper(customer *customer.Customer) {
	customer.Name = strings.ToUpper(customer.Name)

	if customer.Code != nil {
		code := strings.ToUpper(*customer.Code)
		customer.Code = &code
	}

	if customer.Address != nil {
		address := strings.ToUpper(*customer.Address)
		customer.Address = &address
	}

	if customer.City != nil {
		city := strings.ToUpper(*customer.City)
		customer.City = &city
	}

	if customer.State != nil {
		state := strings.ToUpper(*customer.State)
		customer.State = &state
	}
}
