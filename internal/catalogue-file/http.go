package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/tackboon/cm-catalogue/internal/common/auth"
	"github.com/tackboon/cm-catalogue/internal/common/server/httperr"
)

type HttpServer struct {
	db *pgxpool.Pool
}

func NewHttpserver(client *pgxpool.Pool) HttpServer {
	return HttpServer{
		db: client,
	}
}

func (h HttpServer) DeleteTemporaryFiles(w http.ResponseWriter, r *http.Request) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	// select files not used by categories and products
	selectStmt := `
		SELECT t1.id FROM catalogue_files t1
		LEFT JOIN categories t2 ON t1.id = t2.file_id
		LEFT JOIN products_catalogue_files t3 ON t1.id = t3.file_id
		WHERE t2.file_id IS NULL AND t3.file_id IS NULL;
	`

	rows, err := h.db.Query(r.Context(), selectStmt)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		err := rows.Scan(&id)
		if err != nil {
			httperr.RespondWithSlugError(err, w, r)
			return
		}
		ids = append(ids, id)
	}

	// remove files from folder
	var successIDs []string
	filePath := "/file-data"
	for _, id := range ids {
		err = os.Remove(fmt.Sprintf("%s/%s", filePath, id))
		if err == nil {
			successIDs = append(successIDs, id)
			err = os.Remove(fmt.Sprintf("%s/%s.info", filePath, id))
			if err != nil {
				logrus.Info(fmt.Sprintf("Failed to remove file %s.info", id))
			}
		} else {
			logrus.Info(fmt.Sprintf("Failed to remove file %s", id))
		}
	}

	// remove records from db
	deleteStmt := `
		DELETE FROM catalogue_files WHERE id=ANY($1);
	`
	_, err = h.db.Exec(r.Context(), deleteStmt, pq.Array(successIDs))
	if err != nil {
		logrus.Info(fmt.Sprintf("Failed to delete files record: \n%v", successIDs))
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
