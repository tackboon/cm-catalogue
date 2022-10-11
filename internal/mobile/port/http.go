package port

import (
	"fmt"
	"net/http"

	"github.com/go-chi/render"
	"github.com/tackboon/cm-catalogue/internal/common/file"
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
	var src string
	var err error

	if infoType == "db" {
		fileName = "db-data.zip"
		src, err = h.mobileService.ExportDB(r.Context())
		if err != nil {
			httperr.BadRequest("invalid-type", fmt.Errorf("info type can only be either db or file"), w, r)
			return
		}
	} else if infoType == "file" {
		fileName = "file-data.zip"
		src = mobile.FileDataPath
	} else {
		httperr.BadRequest("invalid-type", fmt.Errorf("info type can only be either db or file"), w, r)
		return
	}

	if src == "" {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// Stream Zip and Download to minimize memory use
	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	w.Header().Del("Content-Length")

	err = file.Zip(src, w)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}
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
