package port

import (
	"net/http"

	openapi_types "github.com/deepmap/oapi-codegen/pkg/types"
	"github.com/go-chi/render"
	"github.com/sirupsen/logrus"
	"github.com/tackboon97/cm-catalogue/internal/common/auth"
	"github.com/tackboon97/cm-catalogue/internal/common/server/httperr"
	"github.com/tackboon97/cm-catalogue/internal/customer/app"
	customer "github.com/tackboon97/cm-catalogue/internal/customer/domain"
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

func (h HttpServer) GetAllCustomersData(w http.ResponseWriter, r *http.Request, params GetAllCustomersDataParams) {
	var page int
	var limit int
	var filter string
	var relationshipFilter customer.RelationshipFilter

	if params.Page == nil {
		page = 0
	} else {
		page = *params.Page
	}

	if params.Limit == nil {
		limit = 0
	} else {
		limit = *params.Limit
	}

	if params.Filter == nil {
		filter = ""
	} else {
		filter = *params.Filter
	}

	if string(*params.RelationshipFilter) == string(customer.InCooperationFilter) {
		relationshipFilter = customer.InCooperationFilter
	} else if string(*params.RelationshipFilter) == string(customer.SuspendedFilter) {
		relationshipFilter = customer.SuspendedFilter
	} else {
		relationshipFilter = customer.ALLFilter
	}

	customers, pagination, err := h.customerService.GetAllCustomers(r.Context(), page, limit, filter, relationshipFilter)
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
	} else {
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
	} else {
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

	err = h.customerService.UpdateCustomer(r.Context(), customer)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.GetCustomerDataByID(w, r, customerId)
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
		logrus.Debug(err)
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	var cashbookType customer.CashBookType
	if string(cashBookPost.Type) == string(customer.Debit) {
		cashbookType = customer.Debit
	} else {
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

	err = h.cashbookService.DeleteCashBookRecord(r.Context(), customerId, cashBookRecordId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
	}

	w.WriteHeader(http.StatusNoContent)
}

func appCustomerToResponse(appCustomer customer.Customer) Customer {
	c := Customer{
		Id:                  appCustomer.ID,
		Name:                appCustomer.Name,
		Relationship:        string(appCustomer.Relationship),
		TotalUnbilledAmount: appCustomer.TotalUnbilledAmount,
		CreatedAt:           appCustomer.CreatedAt,
		UpdatedAt:           appCustomer.UpdatedAt,
	}

	if appCustomer.Code != nil {
		c.Code = *appCustomer.Code
	}

	if appCustomer.Contact != nil {
		c.Contact = *appCustomer.Contact
	}

	if appCustomer.Address != nil {
		c.Address = *appCustomer.Address
	}

	if appCustomer.Postcode != nil {
		c.Postcode = *appCustomer.Postcode
	}

	if appCustomer.City != nil {
		c.City = *appCustomer.City
	}

	if appCustomer.State != nil {
		c.State = *appCustomer.State
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
			Id:         item.ID,
			CustomerId: item.CustomerID,
			Date:       openapi_types.Date{item.Date},
			Type:       string(item.Type),
			Amount:     item.Amount,
			CreatedAt:  item.CreatedAt,
			UpdatedAt:  item.UpdatedAt,
		}

		if item.Description != nil {
			c.Description = *item.Description
		}

		cashbooks = append(cashbooks, c)
	}

	return cashbooks
}
