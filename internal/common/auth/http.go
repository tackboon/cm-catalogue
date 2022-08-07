package auth

import (
	"context"
	"net/http"
	"strings"

	"firebase.google.com/go/auth"
	"github.com/tackboon97/cm-catalogue/internal/common/errors"
	"github.com/tackboon97/cm-catalogue/internal/common/server/httperr"
)

type FirebaseAuthHttp struct {
	AuthClient *auth.Client
}

type User struct {
	UUID        string
	Email       string
	Role        string
	DisplayName string
}

type ctxKey string

const (
	userContextKey ctxKey = "user_context_key"
)

func (a FirebaseAuthHttp) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		bearerToken := a.tokenFromHeader(r)
		if bearerToken == "" {
			httperr.Unauthorised("empty-bearer-token", nil, w, r)
			return
		}

		token, err := a.AuthClient.VerifyIDToken(ctx, bearerToken)
		if err != nil {
			httperr.Unauthorised("failed-to-verify-token", err, w, r)
			return
		}

		ctx = context.WithValue(ctx, userContextKey, User{
			UUID:        token.UID,
			Email:       token.Claims["email"].(string),
			Role:        token.Claims["role"].(string),
			DisplayName: token.Claims["name"].(string),
		})
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func (a FirebaseAuthHttp) tokenFromHeader(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")

	if len(authHeader) > 7 && strings.ToLower(authHeader[0:6]) == "bearer" {
		return authHeader[7:]
	}

	return ""
}

func UserFromCtx(ctx context.Context) (User, error) {
	u, ok := ctx.Value(userContextKey).(User)
	if ok {
		return u, nil
	}

	noUserInContextError := errors.NewAuthorizationError("no user in context", "no-user-found")
	return User{}, noUserInContextError
}
