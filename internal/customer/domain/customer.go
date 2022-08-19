package customer

import (
	"regexp"
	"time"

	"github.com/tackboon97/cm-catalogue/internal/common/errors"
)

type Relationship string

const (
	InCooperation Relationship = "in_cooperation"
	Suspended     Relationship = "suspended"
)

type RelationshipFilter string

const (
	ALLFilter           RelationshipFilter = "all"
	InCooperationFilter RelationshipFilter = "in_cooperation"
	SuspendedFilter     RelationshipFilter = "suspended"
)

type Customer struct {
	ID                  int
	Code                *string
	Name                string
	Contact             *string
	Relationship        Relationship
	Address             *string
	Postcode            *string
	City                *string
	State               *string
	TotalUnbilledAmount float32
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

func (c Customer) IsValidCode() error {
	if c.Code != nil && len(*c.Code) > 10 {
		return errors.NewIncorrectInputError("maximum code length is 10 characters.", "invalid-code")
	}

	return nil
}

func (c Customer) IsValidName() error {
	if len(c.Name) == 0 || len(c.Name) > 100 {
		return errors.NewIncorrectInputError("name cannot be empty and maximum name length is 100 characters.", "invalid-name")
	}

	return nil
}

func (c Customer) IsValidContact() error {
	if c.Contact != nil && *c.Contact != "" {
		match, err := regexp.MatchString("^(01)[02-46-9][0-9]{7}$|^(01)[1][0-9]{8}$", *c.Contact)
		if err != nil {
			return err
		}

		if !match {
			return errors.NewIncorrectInputError("invalid Malaysia phone number.", "invalid-contact")
		}
	}

	return nil
}

func (c Customer) IsValidAddress() error {
	if c.Address != nil && len(*c.Address) > 200 {
		return errors.NewIncorrectInputError("maximum address length is 200 characters", "invalid-address")
	}

	return nil
}

func (c Customer) IsValidPostcode() error {
	if c.Postcode != nil && *c.Postcode != "" {
		match, err := regexp.MatchString("^[0-9]{5}$", *c.Postcode)
		if err != nil {
			return err
		}

		if !match {
			return errors.NewIncorrectInputError("invalid Malaysia postcode.", "invalid-postcode")
		}
	}

	return nil
}

func (c Customer) IsValidCity() error {
	if c.City != nil && len(*c.City) > 30 {
		return errors.NewIncorrectInputError("maximum city length is 30 characters", "invalid-city")
	}

	return nil
}

func (c Customer) IsValidState() error {
	if c.State != nil && len(*c.State) > 30 {
		return errors.NewIncorrectInputError("maximum state length is 30 characters", "invalid-state")
	}

	return nil
}
