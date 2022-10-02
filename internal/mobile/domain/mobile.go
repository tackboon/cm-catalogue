package mobile

type VersionName string

const (
	DBVersion   VersionName = "database"
	FileVersion VersionName = "file"
)

const (
	BackUpPath      string = "/db-dump"
	FileDataPath    string = "/file-data"
	ZipFileDataPath string = "/file-zip"
)

type MobileAPIVersion struct {
	Name    string
	Version int
}
