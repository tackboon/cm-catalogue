package main

import (
	"fmt"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/tackboon/cm-catalogue/internal/common/client/mobile"
	"github.com/tackboon/cm-catalogue/internal/common/driver"
	"github.com/tackboon/cm-catalogue/internal/common/logs"
	"github.com/tackboon/cm-catalogue/internal/common/server"
	"github.com/tackboon/cm-catalogue/internal/mobile/adapter"
	"github.com/tackboon/cm-catalogue/internal/mobile/app"
	"github.com/tackboon/cm-catalogue/internal/mobile/port"
	"google.golang.org/grpc"
)

func main() {
	logs.Init()

	conn := driver.NewPostgresConnection()
	defer conn.Close()

	mobileRepository := adapter.NewMobilePostgresRepository(conn)
	mobileService := app.NewMobileService(mobileRepository)

	serverType := os.Getenv("SERVER_TO_RUN")
	switch serverType {
	case "http":
		r := chi.NewRouter()
		server.SetMiddlewares(r)
		port.HandlerFromMuxWithBaseURL(port.NewHttpServer(mobileService), r, "/api/v1/mobile")
		server.RunHTTPServer(r)
	case "grpc":
		server.RunGRPCServer(func(server *grpc.Server) {
			s := port.NewGRPCServer(mobileService)
			mobile.RegisterMobileServiceServer(server, s)
		})
	default:
		panic(fmt.Sprintf("server type '%s' is not supported", serverType))
	}
}
