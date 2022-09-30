package adapter

import (
	"context"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/tackboon/cm-catalogue/internal/common/client/mobile"
)

type MobileGRPC struct {
	client mobile.MobileServiceClient
}

func NewMobileGRPC(client mobile.MobileServiceClient) MobileGRPC {
	return MobileGRPC{
		client: client,
	}
}

func (m MobileGRPC) UpdateDBVersion(ctx context.Context) error {
	_, err := m.client.UpdateDBVersion(ctx, &empty.Empty{})
	return err
}
