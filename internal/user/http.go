package main

import (
	"net"
	"net/http"

	"github.com/go-chi/render"
	"github.com/sirupsen/logrus"
	"github.com/tackboon/cm-catalogue/internal/common/auth"
	"github.com/tackboon/cm-catalogue/internal/common/server/httperr"
)

type HttpServer struct{}

func (h HttpServer) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	authUser, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	host, port, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil {
		logrus.Info("IP:", host, " Port:", port)
	}

	userResponse := User{
		DisplayName: authUser.DisplayName,
		Email:       authUser.Email,
		Role:        authUser.Role,
	}

	render.Respond(w, r, userResponse)
}

type ErrorResponse struct {
	Slug       string `json:"slug"`
	httpStatus int
}

func (e ErrorResponse) Render(w http.ResponseWriter, r *http.Request) error {
	w.WriteHeader(e.httpStatus)
	return nil
}
