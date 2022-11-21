package tests

import (
	"testing"

	"github.com/golang-jwt/jwt/v4"
	"github.com/stretchr/testify/require"
)

func FakeAdminJWT(t *testing.T, userID string) string {
	return fakeJWT(t, jwt.MapClaims{
		"uuid":  userID,
		"email": "admin@cm.com",
		"role":  "admin",
		"name":  "admin",
	})
}

func FakeUserJWT(t *testing.T, userID string) string {
	return fakeJWT(t, jwt.MapClaims{
		"uuid":  userID,
		"email": "user@cm.com",
		"role":  "user",
		"name":  "user",
	})
}

func fakeJWT(t *testing.T, claims jwt.MapClaims) string {
	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)

	tokenString, err := token.SignedString([]byte("mock_secret"))
	require.NoError(t, err)

	return tokenString
}
