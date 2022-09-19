package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/tackboon/cm-catalogue/internal/common/driver"
	"github.com/tackboon/cm-catalogue/internal/common/logs"
	"github.com/tackboon/cm-catalogue/internal/common/server"
	"github.com/tackboon/cm-catalogue/internal/customer/adapter"
	"github.com/tackboon/cm-catalogue/internal/customer/app"
	"github.com/tackboon/cm-catalogue/internal/customer/port"
)

func main() {
	logs.Init()

	conn := driver.NewPostgresConnection()
	defer conn.Close()

	customerRepository := adapter.NewCustomerPostgresRepository(conn)
	customerService := app.NewCustomerService(customerRepository)

	cashbookRepository := adapter.NewCashBookPostgresRepository(conn)
	cashbookService := app.NewCashBookService(cashbookRepository)

	r := chi.NewRouter()
	server.SetMiddlewares(r)
	port.HandlerFromMuxWithBaseURL(port.NewHttpServer(customerService, cashbookService), r, "/api/v1/customers")

	server.RunHTTPServer(r)
}
