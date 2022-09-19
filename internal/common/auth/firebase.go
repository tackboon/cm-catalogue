package auth

import (
	"context"
	"os"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/sirupsen/logrus"
	"google.golang.org/api/option"
)

type FirebaseAuth struct {
	AuthClient *auth.Client
}

func NewFirebaseAuth() FirebaseAuth {
	var opts []option.ClientOption
	if file := os.Getenv("SERVICE_ACCOUNT_FILE"); file != "" {
		opts = append(opts, option.WithCredentialsFile(file))
	}

	firebaseApp, err := firebase.NewApp(context.Background(), nil, opts...)
	if err != nil {
		logrus.WithError(err).Panic("Unable to initialize firebase app.")
	}

	authClient, err := firebaseApp.Auth(context.Background())
	if err != nil {
		logrus.WithError(err).Panic("Unable to create firebase auth client.")
	}

	return FirebaseAuth{AuthClient: authClient}
}

func (a FirebaseAuth) VerifyToken(ctx context.Context, authToken string) (User, error) {
	token, err := a.AuthClient.VerifyIDToken(ctx, authToken)
	if err != nil {
		return User{}, err
	}

	role := token.Claims["role"]
	if role == nil {
		role = "user"
	}

	displayName := token.Claims["name"]
	if displayName == nil {
		displayName = "Anonymous"
	}

	return User{
		UUID:        token.UID,
		Email:       token.Claims["email"].(string),
		Role:        role.(string),
		DisplayName: displayName.(string),
	}, nil
}
