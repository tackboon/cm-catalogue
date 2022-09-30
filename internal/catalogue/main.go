package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/tackboon/cm-catalogue/internal/catalogue/adapter"
	"github.com/tackboon/cm-catalogue/internal/catalogue/app"
	"github.com/tackboon/cm-catalogue/internal/catalogue/port"
	"github.com/tackboon/cm-catalogue/internal/common/client"
	"github.com/tackboon/cm-catalogue/internal/common/driver"
	"github.com/tackboon/cm-catalogue/internal/common/logs"
	"github.com/tackboon/cm-catalogue/internal/common/server"
)

func main() {
	logs.Init()

	conn := driver.NewPostgresConnection()
	defer conn.Close()

	mobileClient, closeMobileClient, err := client.NewMobileClient()
	if err != nil {
		panic(err)
	}
	defer closeMobileClient()
	mobileGRPC := adapter.NewMobileGRPC(mobileClient)

	categoryRepository := adapter.NewCategoryPostgresRepository(conn)
	categoryService := app.NewCategoryservice(categoryRepository, mobileGRPC)

	productRepository := adapter.NewProductPostgresRepository(conn)
	productService := app.NewProductService(productRepository, mobileGRPC)

	r := chi.NewRouter()
	server.SetMiddlewares(r)
	port.HandlerFromMuxWithBaseURL(
		port.NewHttpServer(
			categoryService,
			productService,
		),
		r,
		"/api/v1/catalogue",
	)

	server.RunHTTPServer(r)
}
