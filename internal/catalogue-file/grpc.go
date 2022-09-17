package main

import (
	"context"
	"strings"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/tackboon/cm-catalogue/internal/common/auth"
	tusdproto "github.com/tackboon/tusd/pkg/proto/v2"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type GRPCServer struct {
	db         *pgxpool.Pool
	authClient auth.FirebaseAuth
	tusdproto.UnimplementedHookServiceServer
}

func (g GRPCServer) Send(ctx context.Context, req *tusdproto.SendRequest) (*tusdproto.SendResponse, error) {
	r := req.GetHook()
	f := r.GetUpload()

	switch r.GetName() {
	case "pre-create":
		authToken := ""
		bearerAuth := r.GetHttpRequest().GetBearerAuth()
		if len(bearerAuth) > 7 && strings.ToLower(bearerAuth[0:6]) == "bearer" {
			authToken = bearerAuth[7:]
		}

		_, err := g.authClient.VerifyToken(ctx, authToken)
		if err != nil {
			return nil, status.Error(codes.Unauthenticated, "Unauthenticated.")
		}
	case "post-finish":
		stmt := `
			INSERT INTO catalogue_files (id, path, created_at, updated_at) 
			VALUES ($1, $2, $3, $4);
		`

		_, err := g.db.Exec(ctx, stmt,
			f.GetId(),
			f.GetStorage()["Path"],
			time.Now(),
			time.Now(),
		)
		if err != nil {
			return nil, status.Error(codes.Internal, "Something went wrong.")
		}
	default:
		break
	}

	res := &tusdproto.SendResponse{}
	return res, nil
}
