package app

import (
	"context"
	"strings"

	catalogue "github.com/tackboon/cm-catalogue/internal/catalogue/domain"
	"github.com/tackboon/cm-catalogue/internal/common/errors"
)

type productRepository interface {
	CreateNewProduct(ctx context.Context, product catalogue.Product) (newID int, err error)
	UpdateProductByID(ctx context.Context, product catalogue.Product) error
	DeleteProdcutByID(ctx context.Context, productID int) error
	GetProductByID(ctx context.Context, productID int) (catalogue.Product, error)
	GetAllProducts(ctx context.Context, categoryID int, startPosition float64, limit int, filter string, statusFilter catalogue.StatusFilter) ([]catalogue.Product, error)
	SetProductPosition(ctx context.Context, productID int, position float64) error
}

type ProductService struct {
	repo productRepository
}

func NewProductService(repo productRepository) ProductService {
	if repo == nil {
		panic("missing product repository")
	}

	return ProductService{
		repo: repo,
	}
}

func (p ProductService) CreateNewProduct(ctx context.Context, product catalogue.Product) (newID int, err error) {
	product.Name = strings.Trim(product.Name, " ")
	err = productPostChecking(&product)
	if err != nil {
		return 0, err
	}

	return p.repo.CreateNewProduct(ctx, product)
}

func (p ProductService) UpdateProductByID(ctx context.Context, product catalogue.Product) error {
	product.Name = strings.Trim(product.Name, " ")
	err := productPostChecking(&product)
	if err != nil {
		return err
	}

	return p.repo.UpdateProductByID(ctx, product)
}

func (p ProductService) DeleteProdcutByID(ctx context.Context, productID int) error {
	return p.repo.DeleteProdcutByID(ctx, productID)
}

func (p ProductService) GetProductByID(ctx context.Context, productID int) (catalogue.Product, error) {
	return p.repo.GetProductByID(ctx, productID)
}

func (p ProductService) GetAllProducts(ctx context.Context, categoryID int, startPosition float64, limit int, filter string, statusFilter catalogue.StatusFilter) ([]catalogue.Product, error) {
	var products []catalogue.Product

	if limit > 50 {
		return products, errors.NewSlugError("limit cannot exceed 50", "limit-too-large")
	} else if limit == 0 {
		limit = 20
	}

	if len(filter) > 50 {
		return products, errors.NewSlugError("filter cannot exceed 50 characters", "filter-too-long")
	}

	return p.repo.GetAllProducts(ctx, categoryID, startPosition, limit, filter, statusFilter)
}

func (p ProductService) SetProductPosition(ctx context.Context, productID int, position float64) error {
	return p.repo.SetProductPosition(ctx, productID, position)
}

func productPostChecking(product *catalogue.Product) (err error) {
	if err = product.IsValidName(); err != nil {
		return err
	}

	if err = product.IsValidDescription(); err != nil {
		return err
	}

	if err = product.IsValidPrice(); err != nil {
		return err
	}

	if err = product.IsValidStatusType(); err != nil {
		return err
	}

	product.RemoveDuplicateFileID()

	return nil
}
