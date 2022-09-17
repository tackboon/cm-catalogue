package customer

import (
	"regexp"
	"time"

	"github.com/tackboon/cm-catalogue/internal/common/errors"
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
	Code                string
	Name                string
	Contact             string
	Relationship        Relationship
	Address             string
	Postcode            string
	City                string
	State               string
	TotalUnbilledAmount float32
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

func (c Customer) IsValidCode() error {
	if len(c.Code) > 10 {
		return errors.NewIncorrectInputError(
			"maximum customer code length is 10 characters.",
			"invalid-code",
		)
	}
	return nil
}

func (c Customer) IsValidName() error {
	if len(c.Name) == 0 || len(c.Name) > 100 {
		return errors.NewIncorrectInputError(
			"customer name must between 1-100 characters.",
			"invalid-name",
		)
	}
	return nil
}

func (c Customer) IsValidRelationship() error {
	if c.Relationship != Suspended && c.Relationship != InCooperation {
		return errors.NewIncorrectInputError(
			"invalid customer relationship",
			"invalid-relationship",
		)
	}
	return nil
}

func (c Customer) IsValidContact() error {
	if c.Contact != "" {
		match, err := regexp.MatchString("^(01)[02-46-9][0-9]{7}$|^(01)[1][0-9]{8}$", c.Contact)
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
	if len(c.Address) > 200 {
		return errors.NewIncorrectInputError(
			"maximum customer address length is 200 characters",
			"invalid-address",
		)
	}
	return nil
}

func (c Customer) IsValidPostcode() error {
	if c.Postcode != "" {
		match, err := regexp.MatchString("^[0-9]{5}$", c.Postcode)
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
	if len(c.City) > 30 {
		return errors.NewIncorrectInputError(
			"maximum customer city length is 30 characters",
			"invalid-city",
		)
	}

	return nil
}

func (c Customer) IsValidState() error {
	if len(c.State) > 30 {
		return errors.NewIncorrectInputError(
			"maximum customer state length is 30 characters",
			"invalid-state",
		)
	}
	return nil
}
