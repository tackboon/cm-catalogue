package catalogue

import "github.com/tackboon/cm-catalogue/internal/common/errors"

type Category struct {
	ID     int
	Name   string
	FileID string
}

func (c Category) IsValidName() error {
	if len(c.Name) == 0 || len(c.Name) > 50 {
		return errors.NewIncorrectInputError("category name must between 1-50 characters.", "invalid-name")
	}
	return nil
}
