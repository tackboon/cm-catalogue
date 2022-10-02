package app

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/tackboon/cm-catalogue/internal/common/file"
	mobile "github.com/tackboon/cm-catalogue/internal/mobile/domain"
)

type mobileRepository interface {
	GetMobileAPIVersion(ctx context.Context) ([]mobile.MobileAPIVersion, error)
	UpdateDBVersion(ctx context.Context) error
	UpdateFileVersion(ctx context.Context) error
	ExportTable(ctx context.Context, dirPath string) error
}

type MobileService struct {
	repo mobileRepository
	mu   sync.Mutex
}

func NewMobileService(repo mobileRepository) *MobileService {
	if repo == nil {
		panic("missing mobile repository.")
	}

	return &MobileService{
		repo: repo,
	}
}

func (m *MobileService) GetMobileAPIVersion(ctx context.Context) (map[string]int, error) {
	versionMap := make(map[string]int)

	versions, err := m.repo.GetMobileAPIVersion(ctx)
	if err != nil {
		return versionMap, err
	}

	for _, v := range versions {
		versionMap[v.Name] = v.Version
	}

	return versionMap, nil
}

func (m *MobileService) UpdateDBVersion(ctx context.Context) error {
	return m.repo.UpdateDBVersion(ctx)
}

func (m *MobileService) UpdateFileVersion(ctx context.Context) error {
	return m.repo.UpdateFileVersion(ctx)
}

func (m *MobileService) ExportDB(ctx context.Context) (fileName, filePath string, err error) {
	versionMap, err := m.GetMobileAPIVersion(ctx)
	if err != nil {
		return "", "", err
	}

	var dirPath string
	if v, ok := versionMap[string(mobile.DBVersion)]; ok {
		dirPath = fmt.Sprintf("%s/db_data_%d", mobile.BackUpPath, v)
		fileName = fmt.Sprintf("db_data_%d.zip", v)
		filePath = fmt.Sprintf("%s/%s", mobile.BackUpPath, fileName)
	} else {
		// the db has not update yet
		return "", "", nil
	}

	// make sure export process are not repeated
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, err = os.Stat(filePath); err == nil {
		return
	} else if os.IsNotExist(err) {
		// Remove all old files
		err = file.RemoveContents(mobile.BackUpPath)
		if err != nil {
			return "", "", err
		}

		// Export Table to directory
		err = m.repo.ExportTable(ctx, dirPath)
		if err != nil {
			return "", "", err
		}

		// Zip directory
		f, err := os.Create(filePath)
		if err != nil {
			return "", "", err
		}
		defer f.Close()

		err = file.ZipDirectory(filePath, dirPath)
		if err != nil {
			return "", "", err
		}
	}

	return fileName, filePath, nil
}

func (m *MobileService) ExportFile(ctx context.Context) (fileName, filePath string, err error) {
	versionMap, err := m.GetMobileAPIVersion(ctx)
	if err != nil {
		return "", "", err
	}

	if v, ok := versionMap[string(mobile.FileVersion)]; ok {
		fileName = fmt.Sprintf("file_data_%d.zip", v)
		filePath = fmt.Sprintf("%s/%s", mobile.ZipFileDataPath, fileName)
	} else {
		// the file data has not update yet
		return "", "", nil
	}

	// make sure export process are not repeated
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, err = os.Stat(filePath); err == nil {
		return
	} else if os.IsNotExist(err) {
		// Remove all old files
		err = file.RemoveContents(mobile.ZipFileDataPath)
		if err != nil {
			return "", "", err
		}

		// Zip directory
		f, err := os.Create(filePath)
		if err != nil {
			return "", "", err
		}
		defer f.Close()

		err = file.ZipDirectory(filePath, mobile.FileDataPath)
		if err != nil {
			return "", "", err
		}
	}

	return fileName, filePath, nil
}
