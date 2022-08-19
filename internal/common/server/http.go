package server

import (
	"context"
	"net/http"
	"os"
	"strings"

	firebase "firebase.google.com/go"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/sirupsen/logrus"
	"github.com/tackboon97/cm-catalogue/internal/common/auth"
	"google.golang.org/api/option"
)

func RunHTTPServer(h http.Handler) {
	addr := ":" + os.Getenv("PORT")
	logrus.Info("HTTP server running on port" + addr)

	err := http.ListenAndServe(addr, h)
	if err != nil {
		logrus.WithError(err).Panic("Unable to start HTTP server!")
	}
}

func SetMiddlewares(r *chi.Mux) {
	r.Use(
		middleware.RequestID,
		middleware.RealIP,
		middleware.Recoverer,
		middleware.NoCache,
		middleware.SetHeader("X-Content-Type-Options", "nosniff"),
		middleware.SetHeader("X-Frame-Options", "deny"),
	)

	addCorsMiddleware(r)
	addAuthMiddleware(r)
}

func addCorsMiddleware(r *chi.Mux) {
	allowedOrigins := strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ";")
	if len(allowedOrigins) == 0 {
		return
	}

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	r.Use(corsMiddleware.Handler)
}

func addAuthMiddleware(r *chi.Mux) {
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

	r.Use(auth.FirebaseAuthHttp{AuthClient: authClient}.Middleware)
}
