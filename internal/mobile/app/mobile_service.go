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
	ExportDB(ctx context.Context, dirPath string) error
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

func (m *MobileService) ExportDB(ctx context.Context) (dirPath string, err error) {
	versionMap, err := m.GetMobileAPIVersion(ctx)
	if err != nil {
		return "", err
	}

	if v, ok := versionMap[string(mobile.DBVersion)]; ok {
		dirPath = fmt.Sprintf("%s/db_data_%d", mobile.BackUpPath, v)
	} else {
		// the db has not update yet
		return "", nil
	}

	// make sure export process are not repeated
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, err = os.Stat(dirPath); err == nil {
		return dirPath, nil
	} else if os.IsNotExist(err) {
		// Remove all old files
		err = file.RemoveContents(mobile.BackUpPath)
		if err != nil {
			return "", err
		}

		// Export DB to directory
		err = m.repo.ExportDB(ctx, dirPath)
		if err != nil {
			return "", err
		}
	}

	return dirPath, nil
}
