package main

import (
	"fmt"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/tackboon/cm-catalogue/internal/common/auth"
	"github.com/tackboon/cm-catalogue/internal/common/client"
	"github.com/tackboon/cm-catalogue/internal/common/driver"
	"github.com/tackboon/cm-catalogue/internal/common/logs"
	"github.com/tackboon/cm-catalogue/internal/common/server"
	tusdproto "github.com/tackboon/tusd/pkg/proto/v2"

	"google.golang.org/grpc"
)

func main() {
	logs.Init()

	conn := driver.NewPostgresConnection()
	defer conn.Close()

	authClient := auth.NewFirebaseAuth()

	mobileClient, closeMobileClient, err := client.NewMobileClient()
	if err != nil {
		panic(err)
	}
	defer closeMobileClient()
	mobileGRPC := NewMobileGRPC(mobileClient)

	httpServer := NewHttpserver(conn)

	serverType := os.Getenv("SERVER_TO_RUN")
	switch serverType {
	case "http":
		r := chi.NewRouter()
		server.SetMiddlewares(r)
		HandlerFromMuxWithBaseURL(httpServer, r, "/api/v1/catalogue-file")
		server.RunHTTPServer(r)
	case "grpc":
		server.RunGRPCServer(func(server *grpc.Server) {
			svc := GRPCServer{db: conn, authClient: authClient, mobileService: mobileGRPC}
			tusdproto.RegisterHookServiceServer(server, svc)
		})
	default:
		panic(fmt.Sprintf("server type '%s' is not supported", serverType))
	}
}
