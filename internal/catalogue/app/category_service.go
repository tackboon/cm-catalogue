package app

import (
	"context"
	"strings"

	catalogue "github.com/tackboon/cm-catalogue/internal/catalogue/domain"
)

type categoryRepository interface {
	CreateNewCategory(ctx context.Context, category catalogue.Category) (newID int, err error)
	UpdateCategoryByID(ctx context.Context, category catalogue.Category) error
	DeleteCategoryByID(ctx context.Context, categoryID int) error
	GetCategoryByID(ctx context.Context, categoryID int) (catalogue.Category, error)
	GetAllCategories(ctx context.Context) ([]catalogue.Category, error)
}

type mobileService interface {
	UpdateDBVersion(ctx context.Context) error
}

type CategoryService struct {
	repo          categoryRepository
	mobileService mobileService
}

func NewCategoryservice(repo categoryRepository, mobileService mobileService) CategoryService {
	if repo == nil {
		panic("missing category repository.")
	}

	if mobileService == nil {
		panic("missing mobile service")
	}

	return CategoryService{
		repo:          repo,
		mobileService: mobileService,
	}
}

func (c CategoryService) CreateNewCategory(ctx context.Context, category catalogue.Category) (newID int, err error) {
	category.Name = strings.Replace(category.Name, "|", " ", -1)
	category.Name = strings.Trim(category.Name, " ")

	err = category.IsValidName()
	if err != nil {
		return 0, err
	}

	newID, err = c.repo.CreateNewCategory(ctx, category)
	if err != nil {
		return 0, err
	}

	err = c.mobileService.UpdateDBVersion(ctx)

	return newID, err
}

func (c CategoryService) UpdateCategoryByID(ctx context.Context, category catalogue.Category) error {
	category.Name = strings.Replace(category.Name, "|", " ", -1)
	category.Name = strings.Trim(category.Name, " ")

	err := category.IsValidName()
	if err != nil {
		return err
	}

	err = c.repo.UpdateCategoryByID(ctx, category)
	if err != nil {
		return err
	}

	return c.mobileService.UpdateDBVersion(ctx)
}

func (c CategoryService) DeleteCategoryByID(ctx context.Context, categoryID int) error {
	err := c.repo.DeleteCategoryByID(ctx, categoryID)
	if err != nil {
		return err
	}

	return c.mobileService.UpdateDBVersion(ctx)
}

func (c CategoryService) GetCategoryByID(ctx context.Context, categoryID int) (catalogue.Category, error) {
	return c.repo.GetCategoryByID(ctx, categoryID)
}

func (c CategoryService) GetAllCategories(ctx context.Context) ([]catalogue.Category, error) {
	return c.repo.GetAllCategories(ctx)
}
