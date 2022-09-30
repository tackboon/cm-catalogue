package adapter

import (
	"context"
	"time"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	mobile "github.com/tackboon/cm-catalogue/internal/mobile/domain"
)

type MobileModel struct {
	ID        int
	Name      string
	Version   int
	UpdatedAt time.Time
}

type MobilePostgresRepository struct {
	db *pgxpool.Pool
}

func NewMobilePostgresRepository(client *pgxpool.Pool) MobilePostgresRepository {
	return MobilePostgresRepository{
		db: client,
	}
}

func (m MobilePostgresRepository) GetMobileAPIVersion(ctx context.Context) ([]mobile.MobileAPIVersion, error) {
	var appVersions []mobile.MobileAPIVersion

	stmt := `
		SELECT id, name, version, updated_at FROM mobile;
	`

	rows, err := m.db.Query(ctx, stmt)
	if err != nil {
		return appVersions, err
	}
	defer rows.Close()

	appVersions, err = mobileModelToApp(rows)
	if err != nil {
		return appVersions, err
	}

	return appVersions, nil
}

func (m MobilePostgresRepository) UpdateDBVersion(ctx context.Context) (err error) {
	checkRow := 0
	selectStmt := `
		SELECT 1 FROM mobile WHERE name=$1;
	`
	err = m.db.QueryRow(ctx, selectStmt, mobile.DBVersion).Scan(&checkRow)
	if err != nil && err != pgx.ErrNoRows {
		return err
	}

	if checkRow == 1 {
		updateStmt := `
			UPDATE mobile
				SET version = version + 1
				WHERE name=$1;
		`
		_, err = m.db.Exec(ctx, updateStmt, mobile.DBVersion)
	} else {
		insertStmt := `
			INSERT INTO mobile (name, version, updated_at)
				VALUES ($1, $2, $3);
		`
		_, err = m.db.Exec(ctx, insertStmt, mobile.DBVersion, 1, time.Now())
	}

	if err != nil {
		return err
	}

	return nil
}

func (m MobilePostgresRepository) UpdateFileVersion(ctx context.Context) (err error) {
	checkRow := 0
	selectStmt := `
		SELECT 1 FROM mobile WHERE name=$1;
	`
	err = m.db.QueryRow(ctx, selectStmt, mobile.FileVersion).Scan(&checkRow)
	if err != nil && err != pgx.ErrNoRows {
		return err
	}

	if checkRow == 1 {
		updateStmt := `
			UPDATE mobile
				SET version = version + 1
				WHERE name=$1;
		`
		_, err = m.db.Exec(ctx, updateStmt, mobile.FileVersion)
	} else {
		insertStmt := `
			INSERT INTO mobile (name, version, updated_at)
				VALUES ($1, $2, $3);
		`
		_, err = m.db.Exec(ctx, insertStmt, mobile.FileVersion, 1, time.Now())
	}

	if err != nil {
		return err
	}

	return nil
}

func mobileModelToApp(rows pgx.Rows) ([]mobile.MobileAPIVersion, error) {
	var appVersions []mobile.MobileAPIVersion

	for rows.Next() {
		var m MobileModel

		err := rows.Scan(
			&m.ID,
			&m.Name,
			&m.Version,
			&m.UpdatedAt,
		)

		if err != nil {
			return appVersions, err
		}

		var am mobile.MobileAPIVersion

		am.Name = m.Name
		am.Version = m.Version

		appVersions = append(appVersions, am)
	}

	return appVersions, nil
}
