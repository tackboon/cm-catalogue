package app

import (
	"context"

	mobile "github.com/tackboon/cm-catalogue/internal/mobile/domain"
)

type mobileRepository interface {
	GetMobileAPIVersion(ctx context.Context) ([]mobile.MobileAPIVersion, error)
	UpdateDBVersion(ctx context.Context) error
	UpdateFileVersion(ctx context.Context) error
}

type MobileService struct {
	repo mobileRepository
}

func NewMobileService(repo mobileRepository) MobileService {
	if repo == nil {
		panic("missing mobile repository.")
	}

	return MobileService{
		repo: repo,
	}
}

func (m MobileService) GetMobileAPIVersion(ctx context.Context) (map[string]int, error) {
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

func (m MobileService) UpdateDBVersion(ctx context.Context) error {
	return m.repo.UpdateDBVersion(ctx)
}

func (m MobileService) UpdateFileVersion(ctx context.Context) error {
	return m.repo.UpdateFileVersion(ctx)
}
