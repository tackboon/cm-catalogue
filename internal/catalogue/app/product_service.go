package app

import (
	"context"
	"strings"

	catalogue "github.com/tackboon/cm-catalogue/internal/catalogue/domain"
	"github.com/tackboon/cm-catalogue/internal/common/errors"
)

type productRepository interface {
	CreateNewProduct(ctx context.Context, product catalogue.Product) (newID int, err error)
	UpdateProductByID(ctx context.Context, product catalogue.Product, changeCategory bool) error
	DeleteProdcutByID(ctx context.Context, productID int) error
	GetProductByID(ctx context.Context, productID int) (catalogue.Product, error)
	GetAllProducts(ctx context.Context, categoryID int, startPosition float64, limit int, filter string, statusFilter catalogue.StatusFilter) ([]catalogue.Product, error)
	SetProductPosition(ctx context.Context, productID int, position float64) error
}

type ProductService struct {
	repo          productRepository
	mobileService mobileService
}

func NewProductService(repo productRepository, mobileService mobileService) ProductService {
	if repo == nil {
		panic("missing product repository")
	}

	if mobileService == nil {
		panic("missing mobile service")
	}

	return ProductService{
		repo:          repo,
		mobileService: mobileService,
	}
}

func (p ProductService) CreateNewProduct(ctx context.Context, product catalogue.Product) (newID int, err error) {
	product.Name = strings.Replace(product.Name, "|", " ", -1)
	product.Name = strings.Trim(product.Name, " ")
	product.Description = strings.Replace(product.Description, "|", " ", -1)
	err = productPostChecking(&product)
	if err != nil {
		return 0, err
	}

	newID, err = p.repo.CreateNewProduct(ctx, product)
	if err != nil {
		return 0, err
	}

	err = p.mobileService.UpdateDBVersion(ctx)

	return newID, err
}

func (p ProductService) UpdateProductByID(ctx context.Context, product catalogue.Product, changeCategory bool) error {
	product.Name = strings.Replace(product.Name, "|", " ", -1)
	product.Name = strings.Trim(product.Name, " ")
	product.Description = strings.Replace(product.Description, "|", " ", -1)
	err := productPostChecking(&product)
	if err != nil {
		return err
	}

	err = p.repo.UpdateProductByID(ctx, product, changeCategory)
	if err != nil {
		return err
	}

	return p.mobileService.UpdateDBVersion(ctx)
}

func (p ProductService) DeleteProdcutByID(ctx context.Context, productID int) error {
	err := p.repo.DeleteProdcutByID(ctx, productID)
	if err != nil {
		return err
	}

	return p.mobileService.UpdateDBVersion(ctx)
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
	err := p.repo.SetProductPosition(ctx, productID, position)
	if err != nil {
		return err
	}

	return p.mobileService.UpdateDBVersion(ctx)
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
