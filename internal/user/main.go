package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/tackboon/cm-catalogue/internal/common/logs"
	"github.com/tackboon/cm-catalogue/internal/common/server"
)

func main() {
	logs.Init()

	r := chi.NewRouter()
	server.SetMiddlewares(r)
	HandlerFromMuxWithBaseURL(HttpServer{}, r, "/api/v1/users")

	go loadFixtures()
	server.RunHTTPServer(r)
}
