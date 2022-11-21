package customer_test

import (
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	customer "github.com/tackboon/cm-catalogue/internal/customer/domain"
)

var testCustomer = customer.Customer{
	ID:                  1,
	Code:                "AB123",
	Name:                "Michael",
	Contact:             "0123456789",
	Relationship:        customer.InCooperation,
	Address:             "1/10, Jln 2, Kampung Jambu",
	Postcode:            "59100",
	City:                "Kuala Lumpur",
	State:               "Kuala Lumpur",
	TotalUnbilledAmount: 0.0,
	CreatedAt:           time.Now(),
	UpdatedAt:           time.Now(),
}

var testInvalidCustomer = customer.Customer{
	ID:                  1,
	Code:                strings.Repeat("3", 11),
	Name:                "",
	Contact:             "012345678912",
	Relationship:        "",
	Address:             strings.Repeat("k", 250),
	Postcode:            "591001a",
	City:                strings.Repeat("k", 40),
	State:               strings.Repeat("k", 50),
	TotalUnbilledAmount: -10.0,
	CreatedAt:           time.Now(),
	UpdatedAt:           time.Now(),
}

func TestIsValidCode(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidCode()
	require.NoError(t, err)
}

func TestIsValidCode_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidCode()
	require.Error(t, err)
}

func TestIsValidName(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidName()
	require.NoError(t, err)
}

func TestIsValidName_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidName()
	require.Error(t, err)
}

func TestIsValidRelationship(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidRelationship()
	require.NoError(t, err)
}

func TestIsValidRelationship_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidRelationship()
	require.Error(t, err)
}

func TestIsValidContact(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidContact()
	require.NoError(t, err)
}

func TestIsValidContact_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidContact()
	require.Error(t, err)
}

func TestIsValidAddress(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidAddress()
	require.NoError(t, err)
}

func TestIsValidAddress_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidAddress()
	require.Error(t, err)
}

func TestIsValidPostcode(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidPostcode()
	require.NoError(t, err)
}

func TestIsValidPostcode_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidPostcode()
	require.Error(t, err)
}

func TestIsValidCity(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidCity()
	require.NoError(t, err)
}

func TestIsValidCity_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidCity()
	require.Error(t, err)
}

func TestIsValidState(t *testing.T) {
	t.Parallel()
	err := testCustomer.IsValidState()
	require.NoError(t, err)
}

func TestIsValidState_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCustomer.IsValidState()
	require.Error(t, err)
}
