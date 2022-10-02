package port

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/render"
	"github.com/tackboon/cm-catalogue/internal/common/server/httperr"
	"github.com/tackboon/cm-catalogue/internal/mobile/app"
	mobile "github.com/tackboon/cm-catalogue/internal/mobile/domain"
)

type HttpServer struct {
	mobileService *app.MobileService
}

func NewHttpServer(mobileService *app.MobileService) HttpServer {
	return HttpServer{
		mobileService: mobileService,
	}
}

func (h HttpServer) DownloadData(w http.ResponseWriter, r *http.Request, infoType DownloadDataParamsInfoType) {
	var fileName string
	var filePath string
	var err error

	if infoType == "db" {
		fileName, filePath, err = h.mobileService.ExportDB(r.Context())
	} else if infoType == "file" {
		fileName, filePath, err = h.mobileService.ExportFile(r.Context())
	} else {
		httperr.BadRequest("invalid-type", fmt.Errorf("info type can only be either db or file"), w, r)
		return
	}

	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	// nothing to download
	if filePath == "" {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	file, err := os.Open(filePath)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}
	defer file.Close()

	fileStat, err := file.Stat()
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Length", fmt.Sprint(fileStat.Size()))

	http.ServeContent(w, r, fileName, time.Now(), file)
}

func (h HttpServer) GetMobileAPIInfo(w http.ResponseWriter, r *http.Request) {
	versionMap, err := h.mobileService.GetMobileAPIVersion(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := MobileAPIInfo{
		DbVersion:   versionMap[string(mobile.DBVersion)],
		FileVersion: versionMap[string(mobile.FileVersion)],
	}

	render.Respond(w, r, res)
}
