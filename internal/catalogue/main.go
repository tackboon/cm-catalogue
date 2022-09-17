package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/tackboon/cm-catalogue/internal/catalogue/adapter"
	"github.com/tackboon/cm-catalogue/internal/catalogue/app"
	"github.com/tackboon/cm-catalogue/internal/catalogue/port"
	"github.com/tackboon/cm-catalogue/internal/common/driver"
	"github.com/tackboon/cm-catalogue/internal/common/logs"
	"github.com/tackboon/cm-catalogue/internal/common/server"
)

func main() {
	logs.Init()

	conn := driver.NewPostgresConnection()
	defer conn.Close()

	categoryRepository := adapter.NewCategoryPostgresRepository(conn)
	categoryService := app.NewCategoryservice(categoryRepository)

	productRepository := adapter.NewProductPostgresRepository(conn)
	productService := app.NewProductService(productRepository)

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
