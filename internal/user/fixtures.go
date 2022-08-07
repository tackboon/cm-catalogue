package main

import (
	"context"
	"os"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/sirupsen/logrus"
	"google.golang.org/api/option"
)

func loadFixtures() {
	err := createFirebaseUsers()
	if err != nil {
		logrus.WithError(err).Warn("Unable to create firebase user")
	}
}

func createFirebaseUsers() error {
	var opts []option.ClientOption
	if file := os.Getenv("SERVICE_ACCOUNT_FILE"); file != "" {
		opts = append(opts, option.WithCredentialsFile(file))
	}

	firebaseApp, err := firebase.NewApp(context.Background(), nil, opts...)
	if err != nil {
		return err
	}

	authClient, err := firebaseApp.Auth(context.Background())
	if err != nil {
		return err
	}

	usersToCreate := []struct {
		Email       string
		Password    string
		DisplayName string
		Role        string
	}{
		{

			Email:       "tack@example.com",
			Password:    "123456",
			DisplayName: "Tack",
			Role:        "admin",
		},
	}

	for _, user := range usersToCreate {
		userToCreate := (&auth.UserToCreate{}).
			Email(user.Email).
			Password(user.Password).
			DisplayName(user.DisplayName)

		createdUser, err := authClient.CreateUser(context.Background(), userToCreate)
		if err != nil && auth.IsEmailAlreadyExists(err) {
			continue
		}

		if err != nil {
			return err
		}

		err = authClient.SetCustomUserClaims(context.Background(), createdUser.UID, map[string]interface{}{
			"role": user.Role,
		})
		if err != nil {
			return err
		}

		logrus.Info("[loadfixtures] created user " + user.Email)
	}

	return nil
}
