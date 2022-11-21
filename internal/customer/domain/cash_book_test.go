package customer_test

import (
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	customer "github.com/tackboon/cm-catalogue/internal/customer/domain"
)

var testCashBookRecord = customer.CashBookRecord{
	ID:          1,
	CustomerID:  1,
	Date:        time.Now(),
	Type:        customer.Credit,
	Amount:      10.32,
	Description: "Purchase Item",
	CreatedAt:   time.Now(),
	UpdatedAt:   time.Now(),
}

var testInvalidCashBookRecord = customer.CashBookRecord{
	ID:          1,
	CustomerID:  1,
	Date:        time.Now(),
	Type:        "",
	Amount:      -99,
	Description: strings.Repeat("*", 60),
	CreatedAt:   time.Now(),
	UpdatedAt:   time.Now(),
}

func TestIsValidAmount(t *testing.T) {
	t.Parallel()
	err := testCashBookRecord.IsValidAmount()
	require.NoError(t, err)
}

func TestIsValidAmount_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCashBookRecord.IsValidAmount()
	require.Error(t, err)
}

func TestIsValidType(t *testing.T) {
	t.Parallel()
	err := testCashBookRecord.IsValidType()
	require.NoError(t, err)
}

func TestIsValidType_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCashBookRecord.IsValidType()
	require.Error(t, err)
}

func TestIsValidDescription(t *testing.T) {
	t.Parallel()
	err := testCashBookRecord.IsValidDescription()
	require.NoError(t, err)
}

func TestIsValidDescription_not_valid(t *testing.T) {
	t.Parallel()
	err := testInvalidCashBookRecord.IsValidDescription()
	require.Error(t, err)
}
