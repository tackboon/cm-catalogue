package adapter

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	catalogue "github.com/tackboon/cm-catalogue/internal/catalogue/domain"
	customError "github.com/tackboon/cm-catalogue/internal/common/errors"
)

type CategoryModel struct {
	ID        int
	Name      string
	FileID    *string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type CategoryPostgresRepository struct {
	db *pgxpool.Pool
}

func NewCategoryPostgresRepository(client *pgxpool.Pool) CategoryPostgresRepository {
	return CategoryPostgresRepository{
		db: client,
	}
}

func (c CategoryPostgresRepository) CreateNewCategory(ctx context.Context, category catalogue.Category) (newID int, err error) {
	stmt := `
		INSERT INTO categories (name, file_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4) RETURNING id;
	`

	var fileID *string
	if category.FileID != "" {
		fileID = &category.FileID
	}

	now := time.Now()

	err = c.db.QueryRow(ctx, stmt,
		category.Name,
		fileID,
		now,
		now,
	).Scan(&newID)

	if err != nil {
		var pgerr *pgconn.PgError
		if errors.As(err, &pgerr) && pgerr.ConstraintName == "categories_name_key" {
			return 0, customError.NewSlugError("category name must be unique", "category-name-existed")
		}
		return 0, err
	}

	return newID, nil
}

func (c CategoryPostgresRepository) UpdateCategoryByID(ctx context.Context, category catalogue.Category) error {
	stmt := `
		UPDATE categories SET name=$2, file_id=$3, updated_at=$4
		WHERE id=$1;
	`

	var fileID *string
	if category.FileID != "" {
		fileID = &category.FileID
	}

	_, err := c.db.Exec(ctx, stmt,
		category.ID,
		category.Name,
		fileID,
		time.Now(),
	)

	if err != nil {
		var pgerr *pgconn.PgError
		if errors.As(err, &pgerr) && pgerr.ConstraintName == "categories_name_key" {
			return customError.NewSlugError("category name must be unique", "category-name-existed")
		}
		return err
	}

	return nil
}

func (c CategoryPostgresRepository) DeleteCategoryByID(ctx context.Context, categoryID int) error {
	stmt := `
		DELETE FROM categories WHERE id=$1;
	`

	_, err := c.db.Exec(ctx, stmt, categoryID)
	if err != nil {
		return err
	}

	return nil
}

func (c CategoryPostgresRepository) GetCategoryByID(ctx context.Context, categoryID int) (catalogue.Category, error) {
	var appCategory catalogue.Category

	stmt := `
		SELECT id, name, file_id, created_at, updated_at
		FROM categories WHERE id=$1;
	`

	rows, err := c.db.Query(ctx, stmt, categoryID)
	if err != nil {
		return appCategory, err
	}
	defer rows.Close()

	appCategories, err := categoryModelToApp(rows)
	if err != nil {
		return appCategory, err
	}

	if len(appCategories) == 0 {
		return appCategory, customError.NewSlugError("No record found", "no-record-found")
	}
	appCategory = appCategories[0]

	return appCategory, nil
}

func (c CategoryPostgresRepository) GetAllCategories(ctx context.Context) ([]catalogue.Category, error) {
	var appCategories []catalogue.Category

	stmt := `
		SELECT id, name, file_id, created_at, updated_at
		FROM categories ORDER BY id;
	`

	rows, err := c.db.Query(ctx, stmt)
	if err != nil {
		return appCategories, err
	}

	return categoryModelToApp(rows)
}

func categoryModelToApp(rows pgx.Rows) ([]catalogue.Category, error) {
	var appCategories []catalogue.Category

	for rows.Next() {
		var c CategoryModel

		err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.FileID,
			&c.CreatedAt,
			&c.UpdatedAt,
		)

		if err != nil {
			return appCategories, err
		}

		var ac catalogue.Category

		ac.ID = c.ID
		ac.Name = c.Name

		if c.FileID == nil {
			ac.FileID = ""
		} else {
			ac.FileID = *c.FileID
		}

		appCategories = append(appCategories, ac)
	}

	return appCategories, nil
}
