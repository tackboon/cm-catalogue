package port

import (
	"net/http"

	openapi_types "github.com/deepmap/oapi-codegen/pkg/types"
	"github.com/go-chi/render"
	"github.com/tackboon/cm-catalogue/internal/common/auth"
	"github.com/tackboon/cm-catalogue/internal/common/server/httperr"
	"github.com/tackboon/cm-catalogue/internal/customer/app"
	customer "github.com/tackboon/cm-catalogue/internal/customer/domain"
)

type HttpServer struct {
	customerService app.CustomerService
	cashbookService app.CashBookService
}

func NewHttpServer(customerService app.CustomerService, cashbookService app.CashBookService) HttpServer {
	return HttpServer{
		customerService: customerService,
		cashbookService: cashbookService,
	}
}

func (h HttpServer) CreateCustomerData(w http.ResponseWriter, r *http.Request) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	customerPost := CustomerPost{}
	if err := render.Decode(r, &customerPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	var customerRelationship customer.Relationship
	if string(customerPost.Relationship) == string(customer.Suspended) {
		customerRelationship = customer.Suspended
	} else if string(customerPost.Relationship) == string(customer.InCooperation) {
		customerRelationship = customer.InCooperation
	}

	customer := customer.Customer{
		Code:         customerPost.Code,
		Name:         customerPost.Name,
		Contact:      customerPost.Contact,
		Relationship: customerRelationship,
		Address:      customerPost.Address,
		Postcode:     customerPost.Postcode,
		City:         customerPost.City,
		State:        customerPost.State,
	}

	newID, err := h.customerService.CreateCustomer(r.Context(), customer)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.GetCustomerDataByID(w, r, newID)
}

func (h HttpServer) UpdateCustomerData(w http.ResponseWriter, r *http.Request, customerId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	customerPost := CustomerPost{}
	if err := render.Decode(r, &customerPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	var customerRelationship customer.Relationship
	if string(customerPost.Relationship) == string(customer.Suspended) {
		customerRelationship = customer.Suspended
	} else if string(customerPost.Relationship) == string(customer.InCooperation) {
		customerRelationship = customer.InCooperation
	}

	customer := customer.Customer{
		ID:           customerId,
		Code:         customerPost.Code,
		Name:         customerPost.Name,
		Contact:      customerPost.Contact,
		Relationship: customerRelationship,
		Address:      customerPost.Address,
		Postcode:     customerPost.Postcode,
		City:         customerPost.City,
		State:        customerPost.State,
	}

	err = h.customerService.UpdateCustomerByID(r.Context(), customer)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.GetCustomerDataByID(w, r, customerId)
}

func (h HttpServer) DeleteCutomerData(w http.ResponseWriter, r *http.Request, customerId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	err = h.customerService.DeleteCustomerByID(r.Context(), customerId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h HttpServer) GetCustomerDataByID(w http.ResponseWriter, r *http.Request, customerId int) {
	appCustomer, err := h.customerService.GetCustomerByID(r.Context(), customerId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := appCustomerToResponse(appCustomer)
	render.Respond(w, r, res)
}

func (h HttpServer) GetAllCustomersData(w http.ResponseWriter, r *http.Request, params GetAllCustomersDataParams) {
	page := 0
	limit := 0
	filter := ""
	relationshipFilter := customer.ALLFilter

	if params.Page != nil {
		page = *params.Page
	}

	if params.Limit != nil {
		limit = *params.Limit
	}

	if params.Filter != nil {
		filter = *params.Filter
	}

	if params.RelationshipFilter != nil {
		if string(*params.RelationshipFilter) == string(customer.InCooperationFilter) {
			relationshipFilter = customer.InCooperationFilter
		} else if string(*params.RelationshipFilter) == string(customer.SuspendedFilter) {
			relationshipFilter = customer.SuspendedFilter
		}
	}

	customers, pagination, err := h.customerService.GetAllCustomers(
		r.Context(),
		page,
		limit,
		filter,
		relationshipFilter,
	)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := Customers{
		Data: appCustomersToResponse(customers),
		Pagination: Pagination{
			Count:      pagination.Count,
			Page:       pagination.Page,
			TotalCount: pagination.TotalCount,
		},
	}

	render.Respond(w, r, res)
}

func (h HttpServer) CreateCashBookRecord(w http.ResponseWriter, r *http.Request, customerId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	cashBookPost := CashBookRecordPost{}
	if err := render.Decode(r, &cashBookPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	var cashbookType customer.CashBookType
	if string(cashBookPost.Type) == string(customer.Debit) {
		cashbookType = customer.Debit
	} else if string(cashBookPost.Type) == string(customer.Credit) {
		cashbookType = customer.Credit
	}

	cashbook := customer.CashBookRecord{
		CustomerID:  customerId,
		Date:        cashBookPost.Date,
		Type:        cashbookType,
		Amount:      cashBookPost.Amount,
		Description: cashBookPost.Description,
	}

	err = h.cashbookService.CreateCashBookRecord(r.Context(), cashbook)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h HttpServer) DeleteCashBookRecord(w http.ResponseWriter, r *http.Request, customerId int, cashBookRecordId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	err = h.cashbookService.DeleteCashBookRecord(r.Context(), cashBookRecordId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h HttpServer) GetCashBookRecords(w http.ResponseWriter, r *http.Request, customerId int, params GetCashBookRecordsParams) {
	cashbooks, err := h.cashbookService.GetCashBookRecords(r.Context(), customerId, params.StartAt, params.EndAt)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := CashBookRecords{
		Data: appCashbooksToResponse(cashbooks),
	}

	render.Respond(w, r, res)
}

func appCustomerToResponse(appCustomer customer.Customer) Customer {
	c := Customer{
		Id:                  appCustomer.ID,
		Code:                appCustomer.Code,
		Name:                appCustomer.Name,
		Relationship:        string(appCustomer.Relationship),
		Contact:             appCustomer.Contact,
		Address:             appCustomer.Address,
		Postcode:            appCustomer.Postcode,
		City:                appCustomer.City,
		State:               appCustomer.State,
		TotalUnbilledAmount: appCustomer.TotalUnbilledAmount,
		CreatedAt:           appCustomer.CreatedAt,
		UpdatedAt:           appCustomer.UpdatedAt,
	}

	return c
}

func appCustomersToResponse(appCustomers []customer.Customer) []Customer {
	var customers []Customer

	for _, item := range appCustomers {
		c := appCustomerToResponse(item)
		customers = append(customers, c)
	}

	return customers
}

func appCashbooksToResponse(appCashbooks []customer.CashBookRecord) []CashBookRecord {
	var cashbooks []CashBookRecord

	for _, item := range appCashbooks {
		c := CashBookRecord{
			Id:          item.ID,
			CustomerId:  item.CustomerID,
			Date:        openapi_types.Date{item.Date},
			Type:        string(item.Type),
			Amount:      item.Amount,
			Description: item.Description,
			CreatedAt:   item.CreatedAt,
			UpdatedAt:   item.UpdatedAt,
		}

		cashbooks = append(cashbooks, c)
	}

	return cashbooks
}
