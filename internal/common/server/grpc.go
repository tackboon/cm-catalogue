package server

import (
	"fmt"
	"net"
	"os"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

func RunGRPCServer(registerServer func(server *grpc.Server)) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	grpcEndpoint := fmt.Sprintf(":%s", port)

	grpcServer := grpc.NewServer()
	registerServer(grpcServer)

	listen, err := net.Listen("tcp", grpcEndpoint)
	if err != nil {
		logrus.Panic(err)
	}

	logrus.WithField("grpcEndpoint", grpcEndpoint).Info("Starting GRPC listener")
	err = grpcServer.Serve(listen)
	if err != nil {
		logrus.Panic(err)
	}
}
