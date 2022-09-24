package driver

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/sirupsen/logrus"
)

func NewPostgresConnection() *pgxpool.Pool {
	dsn := fmt.Sprintf(`
		user=%s
		password=%s
		host=%s
		port=%s
		dbname=%s
		sslmode=%s
		pool_max_conns=%s`,
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("PG_HOST"),
		os.Getenv("PG_PORT"),
		os.Getenv("PG_DBNAME"),
		os.Getenv("PG_SSL"),
		os.Getenv("PG_MAX_CONN"),
	)

	conn, err := pgxpool.Connect(context.Background(), dsn)
	if err != nil {
		logrus.WithError(err).Panic("Unable to connect to postgres.")
	}

	return conn
}
