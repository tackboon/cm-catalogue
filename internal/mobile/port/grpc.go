package port

import (
	"context"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/tackboon/cm-catalogue/internal/common/client/mobile"
	"github.com/tackboon/cm-catalogue/internal/mobile/app"
)

type GRPCServer struct {
	mobileService app.MobileService
	mobile.UnimplementedMobileServiceServer
}

func NewGRPCServer(mobileService app.MobileService) GRPCServer {
	return GRPCServer{
		mobileService: mobileService,
	}
}

func (g GRPCServer) UpdateDBVersion(ctx context.Context, req *empty.Empty) (*empty.Empty, error) {
	err := g.mobileService.UpdateDBVersion(ctx)
	return &empty.Empty{}, err
}

func (g GRPCServer) UpdateFileVersion(ctx context.Context, req *empty.Empty) (*empty.Empty, error) {
	err := g.mobileService.UpdateFileVersion(ctx)
	return &empty.Empty{}, err
}
