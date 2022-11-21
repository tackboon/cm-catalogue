package adapter_test

import (
	"testing"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/tackboon/cm-catalogue/internal/customer/adapter"
)

func newCustomerPostgresRepository(t *testing.T, client *pgxpool.Pool) adapter.CustomerPostgresRepository {
	return adapter.NewCustomerPostgresRepository(client)
}
