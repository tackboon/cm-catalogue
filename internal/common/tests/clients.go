package tests

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/tackboon/cm-catalogue/internal/common/client/customer"
)

func authorizationBearer(token string) func(context.Context, *http.Request) error {
	return func(ctx context.Context, req *http.Request) error {
		req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
		return nil
	}
}

type CustomerHTTPClient struct {
	client *customer.ClientWithResponses
}

func NewCustomerHTTPClient(t *testing.T, token string) CustomerHTTPClient {
	addr := "localhost:" + os.Getenv("PORT")
	fmt.Println("Trying customer http:", addr)
	ok := WaitForPort(addr)
	require.True(t, ok, "Customer HTTP timed out")

	url := fmt.Sprintf("http://%v/api/v1/customers", addr)

	client, err := customer.NewClientWithResponses(
		url,
		customer.WithRequestEditorFn(authorizationBearer(token)),
	)
	require.NoError(t, err)

	return CustomerHTTPClient{
		client: client,
	}
}
