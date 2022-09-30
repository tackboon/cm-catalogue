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
	mobileService app.MobileService
}

func NewHttpServer(mobileService app.MobileService) HttpServer {
	return HttpServer{
		mobileService: mobileService,
	}
}

func (h HttpServer) DownloadDB(w http.ResponseWriter, r *http.Request) {

}

// func (h HttpServer) GetCurrentData(w http.ResponseWriter, r *http.Request) {
// 	file, err := os.Open("./test-file/normal.zip")
// 	if err != nil {
// 		logrus.Debug(err)
// 		httperr.RespondWithSlugError(err, w, r)
// 		return
// 	}
// 	defer file.Close()

// 	fileStat, err := file.Stat()
// 	if err != nil {
// 		logrus.Debug(err)
// 		httperr.RespondWithSlugError(err, w, r)
// 		return
// 	}

// 	w.Header().Set("Content-Disposition", "attachment; filename=normal.zip")
// 	w.Header().Set("Content-Type", "application/zip")
// 	w.Header().Set("Content-Length", fmt.Sprint(fileStat.Size()))

// 	io.Copy(w, file)
// }

func (h HttpServer) DownloadFile(w http.ResponseWriter, r *http.Request) {

	fileName := "axs.zip"
	filePath := "/srv/tusd-data/data"

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
	// ZipDirectory("./test-file/axs.zip", "./test-file/normal")
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
