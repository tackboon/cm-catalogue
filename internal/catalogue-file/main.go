package main

import (
	"github.com/tackboon/cm-catalogue/internal/common/auth"
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

	server.RunGRPCServer(func(server *grpc.Server) {
		svc := GRPCServer{db: conn, authClient: authClient}
		tusdproto.RegisterHookServiceServer(server, svc)
	})
}
