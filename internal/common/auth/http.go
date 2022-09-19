package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/tackboon/cm-catalogue/internal/common/errors"
	"github.com/tackboon/cm-catalogue/internal/common/server/httperr"
)

type authProvider interface {
	VerifyToken(ctx context.Context, authToken string) (User, error)
}

type AuthHTTP struct {
	AuthProvider authProvider
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

func (a AuthHTTP) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		bearerToken := a.tokenFromHeader(r)
		if bearerToken == "" {
			httperr.Unauthorised("empty-bearer-token", nil, w, r)
			return
		}

		user, err := a.AuthProvider.VerifyToken(ctx, bearerToken)
		if err != nil {
			httperr.Unauthorised("failed-to-verify-token", err, w, r)
			return
		}

		ctx = context.WithValue(ctx, userContextKey, user)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func (a AuthHTTP) tokenFromHeader(r *http.Request) string {
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
