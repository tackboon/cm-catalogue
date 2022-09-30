package mobile

type VersionName string

const (
	DBVersion   VersionName = "database"
	FileVersion VersionName = "file"
)

type MobileAPIVersion struct {
	Name    string
	Version int
}
