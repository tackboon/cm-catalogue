package server

import (
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/sirupsen/logrus"
	"github.com/tackboon/cm-catalogue/internal/common/auth"
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
	firebaseAuth := auth.NewFirebaseAuth()
	r.Use(auth.AuthHTTP{AuthProvider: firebaseAuth}.Middleware)
}
