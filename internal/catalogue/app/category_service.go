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

type CategoryService struct {
	repo categoryRepository
}

func NewCategoryservice(repo categoryRepository) CategoryService {
	if repo == nil {
		panic("missing category repository.")
	}

	return CategoryService{
		repo: repo,
	}
}

func (c CategoryService) CreateNewCategory(ctx context.Context, category catalogue.Category) (newID int, err error) {
	category.Name = strings.Trim(category.Name, " ")

	err = category.IsValidName()
	if err != nil {
		return 0, err
	}

	return c.repo.CreateNewCategory(ctx, category)
}

func (c CategoryService) UpdateCategoryByID(ctx context.Context, category catalogue.Category) error {
	category.Name = strings.Trim(category.Name, " ")

	err := category.IsValidName()
	if err != nil {
		return err
	}

	return c.repo.UpdateCategoryByID(ctx, category)
}

func (c CategoryService) DeleteCategoryByID(ctx context.Context, categoryID int) error {
	return c.repo.DeleteCategoryByID(ctx, categoryID)
}

func (c CategoryService) GetCategoryByID(ctx context.Context, categoryID int) (catalogue.Category, error) {
	return c.repo.GetCategoryByID(ctx, categoryID)
}

func (c CategoryService) GetAllCategories(ctx context.Context) ([]catalogue.Category, error) {
	return c.repo.GetAllCategories(ctx)
}
