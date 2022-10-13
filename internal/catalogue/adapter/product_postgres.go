package adapter

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	catalogue "github.com/tackboon/cm-catalogue/internal/catalogue/domain"
	customError "github.com/tackboon/cm-catalogue/internal/common/errors"
)

type ProducLeftJoinFileModel struct {
	ID          int
	CategoryID  int
	Name        string
	Description *string
	Price       float32
	Status      string
	Position    float64
	FileID      *string
	IsPreview   *int
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type ProductCatalogueFileModel struct {
	ProductID int
	FileID    string
	IsPreview int
}

type ProductPostgresRepository struct {
	db *pgxpool.Pool
}

func NewProductPostgresRepository(client *pgxpool.Pool) ProductPostgresRepository {
	return ProductPostgresRepository{
		db: client,
	}
}

func (p ProductPostgresRepository) CreateNewProduct(ctx context.Context, product catalogue.Product) (newID int, err error) {
	tx, err := p.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			tx.Rollback(ctx)
		} else {
			tx.Commit(ctx)
		}
	}()

	productStmt := `
		INSERT INTO products (category_id, name, description, price, status,
			created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
	`

	now := time.Now()

	err = tx.QueryRow(ctx, productStmt,
		product.CategoryID,
		product.Name,
		product.Description,
		product.Price,
		product.Status,
		now,
		now,
	).Scan(&newID)

	if err != nil {
		var pgerr *pgconn.PgError
		if errors.As(err, &pgerr) && pgerr.ConstraintName == "products_name_key" {
			return 0, customError.NewSlugError("product name must be unique", "product-name-existed")
		}
		return 0, err
	}

	if product.FileIDs != nil && len(product.FileIDs) > 0 {
		err = insertProductFiles(ctx, tx, newID, product.FileIDs, product.PreviewID)
		if err != nil {
			return 0, err
		}
	}

	return newID, nil
}

func (p ProductPostgresRepository) UpdateProductByID(ctx context.Context, product catalogue.Product, changeCategory bool) error {
	tx, err := p.db.BeginTx(ctx, pgx.TxOptions{})
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

	var productArgs []interface{}
	productArgs = append(productArgs,
		product.ID,
		product.Name,
		product.Description,
		product.Price,
		product.Status,
		time.Now(),
	)

	changeCategoryStmt := ""
	if changeCategory {
		changeCategoryStmt = ", category_id=$7, position=nextval('products_position_seq')"
		productArgs = append(productArgs, product.CategoryID)
	}

	productStmt := `
		UPDATE products SET name=$2, description=$3, price=$4, status=$5, updated_at=$6` + changeCategoryStmt + `
		WHERE id=$1;
	`

	_, err = tx.Exec(ctx, productStmt, productArgs...)

	if err != nil {
		var pgerr *pgconn.PgError
		if errors.As(err, &pgerr) && pgerr.ConstraintName == "products_name_key" {
			return customError.NewSlugError("product name must be unique", "product-name-existed")
		}
		return err
	}

	removeFilesStmt := `
		DELETE FROM products_catalogue_files WHERE product_id=$1;
	`

	_, err = tx.Exec(ctx, removeFilesStmt, product.ID)
	if err != nil {
		return err
	}

	if product.FileIDs != nil && len(product.FileIDs) > 0 {
		err = insertProductFiles(ctx, tx, product.ID, product.FileIDs, product.PreviewID)
		if err != nil {
			return err
		}
	}

	return nil
}

func (p ProductPostgresRepository) DeleteProdcutByID(ctx context.Context, productID int) error {
	stmt := `
		DELETE FROM products WHERE id=$1;
	`

	_, err := p.db.Exec(ctx, stmt, productID)
	if err != nil {
		return err
	}

	return nil
}

func (p ProductPostgresRepository) GetProductByID(ctx context.Context, productID int) (catalogue.Product, error) {
	var appProduct catalogue.Product

	stmt := `
		SELECT p.id, p.category_id, p.name, p.description, p.price, p.status, p.position, 
			f.file_id, f.is_preview
		FROM products p
		LEFT JOIN products_catalogue_files f ON p.id=f.product_id
		WHERE p.id=$1;
	`

	rows, err := p.db.Query(ctx, stmt, productID)
	if err != nil {
		return appProduct, err
	}
	defer rows.Close()

	appProducts, err := productModelToApp(rows)
	if err != nil {
		return appProduct, err
	}

	if len(appProducts) == 0 {
		return appProduct, customError.NewSlugError("No record found", "no-record-found")
	}
	appProduct = appProducts[0]

	return appProduct, nil
}

func (p ProductPostgresRepository) GetAllProducts(ctx context.Context, categoryID int, startPosition float64, limit int, filter string, statusFilter catalogue.StatusFilter) ([]catalogue.Product, error) {
	var appProducts []catalogue.Product
	var startPositionQuery string
	var statusFilterQuery string
	var rows pgx.Rows
	var err error

	if startPosition == 0 {
		startPositionQuery = " position >= $1 AND"
	} else {
		startPositionQuery = " position < $1 AND"
	}

	if statusFilter == catalogue.InStockFilter {
		statusFilterQuery = "status IN ('in_stock') "
	} else if statusFilter == catalogue.OutOfStockFilter {
		statusFilterQuery = "status IN ('out_of_stock') "
	} else {
		statusFilterQuery = "status IN ('in_stock', 'out_of_stock') "
	}

	if filter == "" {
		stmt := `SELECT p.id, p.category_id, p.name, p.description, p.price, p.status, p.position,
				f.file_id, f.is_preview
				FROM products p
				LEFT JOIN products_catalogue_files f ON p.id=f.product_id
				WHERE p.id IN (
					SELECT id FROM products
					WHERE` + startPositionQuery + ` category_id=$2 AND ` + statusFilterQuery + `
					ORDER BY position DESC, name
					LIMIT $3
				)
				ORDER BY p.position DESC, name;`

		rows, err = p.db.Query(ctx, stmt, startPosition, categoryID, limit)
		if err != nil {
			return appProducts, err
		}
		defer rows.Close()
	} else {
		stmt := `SELECT p.id, p.category_id, p.name, p.description, p.price, p.status, p.position, 
				f.file_id, f.is_preview
				FROM products p
				LEFT JOIN products_catalogue_files f ON p.id=f.product_id
				WHERE p.id IN (
					SELECT id FROM products
					WHERE` + startPositionQuery + ` category_id=$2 AND ` + statusFilterQuery + `
					AND tsvector_document @@ plainto_tsquery($3)
					ORDER BY position DESC, ts_rank(tsvector_document, plainto_tsquery($3)) DESC
					LIMIT $4
				)
				ORDER BY position DESC, ts_rank(tsvector_document, plainto_tsquery($3)) DESC;`

		rows, err = p.db.Query(ctx, stmt, startPosition, categoryID, filter, limit)
		if err != nil {
			return appProducts, err
		}
		defer rows.Close()
	}

	appProducts, err = productModelToApp(rows)
	if err != nil {
		return appProducts, err
	}

	return appProducts, nil
}

func (p ProductPostgresRepository) SetProductPosition(ctx context.Context, productID int, position float64) error {
	stmt := `
		UPDATE products SET position=$2, updated_at=$3
		WHERE id=$1;
	`

	_, err := p.db.Exec(ctx, stmt, productID, position, time.Now())
	if err != nil {
		return err
	}

	return nil
}

func productModelToApp(rows pgx.Rows) ([]catalogue.Product, error) {
	var appProducts []catalogue.Product
	m := map[int]catalogue.Product{}
	var arrangement []int

	for rows.Next() {
		var p ProducLeftJoinFileModel

		err := rows.Scan(
			&p.ID,
			&p.CategoryID,
			&p.Name,
			&p.Description,
			&p.Price,
			&p.Status,
			&p.Position,
			&p.FileID,
			&p.IsPreview,
		)

		if err != nil {
			return appProducts, err
		}

		if val, ok := m[p.ID]; ok {
			if p.FileID != nil {
				val.FileIDs = append(val.FileIDs, *p.FileID)

				if p.IsPreview != nil && *p.IsPreview == 1 {
					val.PreviewID = *p.FileID
				}

				m[p.ID] = val
			}
		} else {
			arrangement = append(arrangement, p.ID)

			var ap catalogue.Product

			ap.ID = p.ID
			ap.CategoryID = p.CategoryID
			ap.Name = p.Name
			ap.Price = p.Price
			ap.Position = p.Position

			if p.Description != nil {
				ap.Description = *p.Description
			}

			if p.Status == string(catalogue.InStock) {
				ap.Status = catalogue.InStock
			} else if p.Status == string(catalogue.OutOfStock) {
				ap.Status = catalogue.OutOfStock
			}

			if p.FileID != nil {
				ap.FileIDs = append(ap.FileIDs, *p.FileID)

				if p.IsPreview != nil && *p.IsPreview == 1 {
					ap.PreviewID = *p.FileID
				}
			}

			m[p.ID] = ap
		}
	}

	for _, value := range arrangement {
		if val, ok := m[value]; ok {
			appProducts = append(appProducts, val)
		}
	}

	return appProducts, nil
}

func insertProductFiles(ctx context.Context, tx pgx.Tx, productID int, fileIDs []string, previewID string) error {
	var ids []interface{}

	fileStmt := `
			INSERT INTO products_catalogue_files (product_id, file_id, is_preview)
			VALUES
		`

	for key, value := range fileIDs {
		if previewID == value {
			fileStmt = fileStmt + fmt.Sprintf("(%d,$%d,%d),", productID, key+1, 1)
		} else {
			fileStmt = fileStmt + fmt.Sprintf("(%d,$%d,%d),", productID, key+1, 0)
		}
		ids = append(ids, value)
	}

	fileStmt = fileStmt[:len(fileStmt)-1] + ";"

	_, err := tx.Exec(ctx, fileStmt, ids...)
	if err != nil {
		return err
	}

	return nil
}
