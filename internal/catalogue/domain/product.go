package catalogue

import (
	"github.com/tackboon/cm-catalogue/internal/common/errors"
)

type ProductStatusType string

const (
	InStock    ProductStatusType = "in_stock"
	OutOfStock ProductStatusType = "out_of_stock"
)

type StatusFilter string

const (
	AllFilter        StatusFilter = "all"
	InStockFilter    StatusFilter = "in_stock"
	OutOfStockFilter StatusFilter = "out_of_stock"
)

type Product struct {
	ID          int
	Name        string
	Description string
	Price       float32
	Status      ProductStatusType
	FileIDs     []string
	PreviewID   string
	Position    float64
	CategoryID  int
}

func (p Product) IsValidName() error {
	if len(p.Name) == 0 || len(p.Name) > 200 {
		return errors.NewIncorrectInputError("product name must between 1-200 characters.", "invalid-name")
	}
	return nil
}

func (p Product) IsValidDescription() error {
	if len(p.Description) > 200 {
		return errors.NewIncorrectInputError("product description must less than 200 characters", "invalid-description")
	}
	return nil
}

func (p Product) IsValidPrice() error {
	if p.Price < 0 || p.Price > 1000000 {
		return errors.NewIncorrectInputError("invalid product price", "invalid-price")
	}
	return nil
}

func (p Product) IsValidStatusType() error {
	if p.Status != InStock && p.Status != OutOfStock {
		return errors.NewIncorrectInputError("invalid product status type", "invalid-status")
	}
	return nil
}

func (p *Product) RemoveDuplicateFileID() {
	m := make(map[string]bool)
	list := []string{}

	for _, item := range p.FileIDs {
		if _, ok := m[item]; !ok {
			m[item] = true
			list = append(list, item)
		}
	}
	p.FileIDs = make([]string, len(list))
	copy(p.FileIDs, list)
}
