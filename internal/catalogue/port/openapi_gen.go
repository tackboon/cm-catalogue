// Package port provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.11.0 DO NOT EDIT.
package port

import (
	"context"
	"fmt"
	"net/http"

	"github.com/deepmap/oapi-codegen/pkg/runtime"
	"github.com/go-chi/chi/v5"
)

const (
	BearerAuthScopes = "bearerAuth.Scopes"
)

// Defines values for ProductPostStatus.
const (
	InStock    ProductPostStatus = "in_stock"
	OutOfStock ProductPostStatus = "out_of_stock"
)

// Categories defines model for Categories.
type Categories struct {
	Categories []Category `json:"categories"`
}

// Category defines model for Category.
type Category struct {
	FileId string `json:"file_id"`
	Id     int    `json:"id"`
	Name   string `json:"name"`
}

// CategoryPost defines model for CategoryPost.
type CategoryPost struct {
	FileId *string `json:"file_id,omitempty"`
	Name   string  `json:"name"`
}

// CategoryProducts defines model for CategoryProducts.
type CategoryProducts struct {
	Data []Product `json:"data"`
}

// ModelError defines model for ModelError.
type ModelError struct {
	Message string `json:"message"`
	Slug    string `json:"slug"`
}

// Product defines model for Product.
type Product struct {
	Description string   `json:"description"`
	FileIds     []string `json:"file_ids"`
	Id          int      `json:"id"`
	Name        string   `json:"name"`

	// number use for customize sorting
	Position  float64 `json:"position"`
	PreviewId string  `json:"preview_id"`
	Price     float32 `json:"price"`
	Status    string  `json:"status"`
}

// ProductPost defines model for ProductPost.
type ProductPost struct {
	Description string            `json:"description"`
	FileIds     *[]string         `json:"file_ids,omitempty"`
	Name        string            `json:"name"`
	PreviewId   *string           `json:"preview_id,omitempty"`
	Price       float32           `json:"price"`
	Status      ProductPostStatus `json:"status"`
}

// ProductPostStatus defines model for ProductPost.Status.
type ProductPostStatus string

// Unexpected defines model for Unexpected.
type Unexpected = ModelError

// CreateCategoryJSONBody defines parameters for CreateCategory.
type CreateCategoryJSONBody = CategoryPost

// UpdateCategoryJSONBody defines parameters for UpdateCategory.
type UpdateCategoryJSONBody = CategoryPost

// GetAllCategoryProductsParams defines parameters for GetAllCategoryProducts.
type GetAllCategoryProductsParams struct {
	StartPosition *float64                                  `form:"start_position,omitempty" json:"start_position,omitempty"`
	Limit         *int                                      `form:"limit,omitempty" json:"limit,omitempty"`
	Filter        *string                                   `form:"filter,omitempty" json:"filter,omitempty"`
	StatusFilter  *GetAllCategoryProductsParamsStatusFilter `form:"statusFilter,omitempty" json:"statusFilter,omitempty"`
}

// GetAllCategoryProductsParamsStatusFilter defines parameters for GetAllCategoryProducts.
type GetAllCategoryProductsParamsStatusFilter string

// CreateProductJSONBody defines parameters for CreateProduct.
type CreateProductJSONBody = ProductPost

// UpdateProductJSONBody defines parameters for UpdateProduct.
type UpdateProductJSONBody = ProductPost

// UpdateProductParams defines parameters for UpdateProduct.
type UpdateProductParams struct {
	NewCategoryId *int `form:"new_category_id,omitempty" json:"new_category_id,omitempty"`
}

// SetProductPositionJSONBody defines parameters for SetProductPosition.
type SetProductPositionJSONBody struct {
	Position *int `json:"position,omitempty"`
}

// CreateCategoryJSONRequestBody defines body for CreateCategory for application/json ContentType.
type CreateCategoryJSONRequestBody = CreateCategoryJSONBody

// UpdateCategoryJSONRequestBody defines body for UpdateCategory for application/json ContentType.
type UpdateCategoryJSONRequestBody = UpdateCategoryJSONBody

// CreateProductJSONRequestBody defines body for CreateProduct for application/json ContentType.
type CreateProductJSONRequestBody = CreateProductJSONBody

// UpdateProductJSONRequestBody defines body for UpdateProduct for application/json ContentType.
type UpdateProductJSONRequestBody = UpdateProductJSONBody

// SetProductPositionJSONRequestBody defines body for SetProductPosition for application/json ContentType.
type SetProductPositionJSONRequestBody SetProductPositionJSONBody

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// Get all categories
	// (GET /categories)
	GetAllCategories(w http.ResponseWriter, r *http.Request)
	// Create a new category
	// (POST /categories)
	CreateCategory(w http.ResponseWriter, r *http.Request)
	// Delete a category
	// (DELETE /categories/{category_id})
	DeleteCategory(w http.ResponseWriter, r *http.Request, categoryId int)
	// Get category by id
	// (GET /categories/{category_id})
	GetCategoryByID(w http.ResponseWriter, r *http.Request, categoryId int)
	// Edit the category field
	// (PUT /categories/{category_id})
	UpdateCategory(w http.ResponseWriter, r *http.Request, categoryId int)
	// Get all products for a category
	// (GET /categories/{category_id}/products)
	GetAllCategoryProducts(w http.ResponseWriter, r *http.Request, categoryId int, params GetAllCategoryProductsParams)
	// Create new product
	// (POST /categories/{category_id}/products)
	CreateProduct(w http.ResponseWriter, r *http.Request, categoryId int)
	// Delete product by ID
	// (DELETE /categories/{category_id}/products/{product_id})
	DeleteProduct(w http.ResponseWriter, r *http.Request, categoryId int, productId int)
	// Get product by id
	// (GET /categories/{category_id}/products/{product_id})
	GetProductByID(w http.ResponseWriter, r *http.Request, categoryId int, productId int)
	// Update product by ID
	// (PUT /categories/{category_id}/products/{product_id})
	UpdateProduct(w http.ResponseWriter, r *http.Request, categoryId int, productId int, params UpdateProductParams)
	// Set product position
	// (PUT /categories/{category_id}/products/{product_id}/set-position)
	SetProductPosition(w http.ResponseWriter, r *http.Request, categoryId int, productId int)
}

// ServerInterfaceWrapper converts contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler            ServerInterface
	HandlerMiddlewares []MiddlewareFunc
	ErrorHandlerFunc   func(w http.ResponseWriter, r *http.Request, err error)
}

type MiddlewareFunc func(http.HandlerFunc) http.HandlerFunc

// GetAllCategories operation middleware
func (siw *ServerInterfaceWrapper) GetAllCategories(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.GetAllCategories(w, r)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// CreateCategory operation middleware
func (siw *ServerInterfaceWrapper) CreateCategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.CreateCategory(w, r)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// DeleteCategory operation middleware
func (siw *ServerInterfaceWrapper) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.DeleteCategory(w, r, categoryId)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// GetCategoryByID operation middleware
func (siw *ServerInterfaceWrapper) GetCategoryByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.GetCategoryByID(w, r, categoryId)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// UpdateCategory operation middleware
func (siw *ServerInterfaceWrapper) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.UpdateCategory(w, r, categoryId)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// GetAllCategoryProducts operation middleware
func (siw *ServerInterfaceWrapper) GetAllCategoryProducts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	// Parameter object where we will unmarshal all parameters from the context
	var params GetAllCategoryProductsParams

	// ------------- Optional query parameter "start_position" -------------
	if paramValue := r.URL.Query().Get("start_position"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "start_position", r.URL.Query(), &params.StartPosition)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "start_position", Err: err})
		return
	}

	// ------------- Optional query parameter "limit" -------------
	if paramValue := r.URL.Query().Get("limit"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "limit", r.URL.Query(), &params.Limit)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "limit", Err: err})
		return
	}

	// ------------- Optional query parameter "filter" -------------
	if paramValue := r.URL.Query().Get("filter"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "filter", r.URL.Query(), &params.Filter)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "filter", Err: err})
		return
	}

	// ------------- Optional query parameter "statusFilter" -------------
	if paramValue := r.URL.Query().Get("statusFilter"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "statusFilter", r.URL.Query(), &params.StatusFilter)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "statusFilter", Err: err})
		return
	}

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.GetAllCategoryProducts(w, r, categoryId, params)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// CreateProduct operation middleware
func (siw *ServerInterfaceWrapper) CreateProduct(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.CreateProduct(w, r, categoryId)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// DeleteProduct operation middleware
func (siw *ServerInterfaceWrapper) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	// ------------- Path parameter "product_id" -------------
	var productId int

	err = runtime.BindStyledParameter("simple", false, "product_id", chi.URLParam(r, "product_id"), &productId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "product_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.DeleteProduct(w, r, categoryId, productId)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// GetProductByID operation middleware
func (siw *ServerInterfaceWrapper) GetProductByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	// ------------- Path parameter "product_id" -------------
	var productId int

	err = runtime.BindStyledParameter("simple", false, "product_id", chi.URLParam(r, "product_id"), &productId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "product_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.GetProductByID(w, r, categoryId, productId)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// UpdateProduct operation middleware
func (siw *ServerInterfaceWrapper) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	// ------------- Path parameter "product_id" -------------
	var productId int

	err = runtime.BindStyledParameter("simple", false, "product_id", chi.URLParam(r, "product_id"), &productId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "product_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	// Parameter object where we will unmarshal all parameters from the context
	var params UpdateProductParams

	// ------------- Optional query parameter "new_category_id" -------------
	if paramValue := r.URL.Query().Get("new_category_id"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "new_category_id", r.URL.Query(), &params.NewCategoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "new_category_id", Err: err})
		return
	}

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.UpdateProduct(w, r, categoryId, productId, params)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// SetProductPosition operation middleware
func (siw *ServerInterfaceWrapper) SetProductPosition(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "category_id" -------------
	var categoryId int

	err = runtime.BindStyledParameter("simple", false, "category_id", chi.URLParam(r, "category_id"), &categoryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "category_id", Err: err})
		return
	}

	// ------------- Path parameter "product_id" -------------
	var productId int

	err = runtime.BindStyledParameter("simple", false, "product_id", chi.URLParam(r, "product_id"), &productId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "product_id", Err: err})
		return
	}

	ctx = context.WithValue(ctx, BearerAuthScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.SetProductPosition(w, r, categoryId, productId)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

type UnescapedCookieParamError struct {
	ParamName string
	Err       error
}

func (e *UnescapedCookieParamError) Error() string {
	return fmt.Sprintf("error unescaping cookie parameter '%s'", e.ParamName)
}

func (e *UnescapedCookieParamError) Unwrap() error {
	return e.Err
}

type UnmarshalingParamError struct {
	ParamName string
	Err       error
}

func (e *UnmarshalingParamError) Error() string {
	return fmt.Sprintf("Error unmarshaling parameter %s as JSON: %s", e.ParamName, e.Err.Error())
}

func (e *UnmarshalingParamError) Unwrap() error {
	return e.Err
}

type RequiredParamError struct {
	ParamName string
}

func (e *RequiredParamError) Error() string {
	return fmt.Sprintf("Query argument %s is required, but not found", e.ParamName)
}

type RequiredHeaderError struct {
	ParamName string
	Err       error
}

func (e *RequiredHeaderError) Error() string {
	return fmt.Sprintf("Header parameter %s is required, but not found", e.ParamName)
}

func (e *RequiredHeaderError) Unwrap() error {
	return e.Err
}

type InvalidParamFormatError struct {
	ParamName string
	Err       error
}

func (e *InvalidParamFormatError) Error() string {
	return fmt.Sprintf("Invalid format for parameter %s: %s", e.ParamName, e.Err.Error())
}

func (e *InvalidParamFormatError) Unwrap() error {
	return e.Err
}

type TooManyValuesForParamError struct {
	ParamName string
	Count     int
}

func (e *TooManyValuesForParamError) Error() string {
	return fmt.Sprintf("Expected one value for %s, got %d", e.ParamName, e.Count)
}

// Handler creates http.Handler with routing matching OpenAPI spec.
func Handler(si ServerInterface) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{})
}

type ChiServerOptions struct {
	BaseURL          string
	BaseRouter       chi.Router
	Middlewares      []MiddlewareFunc
	ErrorHandlerFunc func(w http.ResponseWriter, r *http.Request, err error)
}

// HandlerFromMux creates http.Handler with routing matching OpenAPI spec based on the provided mux.
func HandlerFromMux(si ServerInterface, r chi.Router) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{
		BaseRouter: r,
	})
}

func HandlerFromMuxWithBaseURL(si ServerInterface, r chi.Router, baseURL string) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{
		BaseURL:    baseURL,
		BaseRouter: r,
	})
}

// HandlerWithOptions creates http.Handler with additional options
func HandlerWithOptions(si ServerInterface, options ChiServerOptions) http.Handler {
	r := options.BaseRouter

	if r == nil {
		r = chi.NewRouter()
	}
	if options.ErrorHandlerFunc == nil {
		options.ErrorHandlerFunc = func(w http.ResponseWriter, r *http.Request, err error) {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
	}
	wrapper := ServerInterfaceWrapper{
		Handler:            si,
		HandlerMiddlewares: options.Middlewares,
		ErrorHandlerFunc:   options.ErrorHandlerFunc,
	}

	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/categories", wrapper.GetAllCategories)
	})
	r.Group(func(r chi.Router) {
		r.Post(options.BaseURL+"/categories", wrapper.CreateCategory)
	})
	r.Group(func(r chi.Router) {
		r.Delete(options.BaseURL+"/categories/{category_id}", wrapper.DeleteCategory)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/categories/{category_id}", wrapper.GetCategoryByID)
	})
	r.Group(func(r chi.Router) {
		r.Put(options.BaseURL+"/categories/{category_id}", wrapper.UpdateCategory)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/categories/{category_id}/products", wrapper.GetAllCategoryProducts)
	})
	r.Group(func(r chi.Router) {
		r.Post(options.BaseURL+"/categories/{category_id}/products", wrapper.CreateProduct)
	})
	r.Group(func(r chi.Router) {
		r.Delete(options.BaseURL+"/categories/{category_id}/products/{product_id}", wrapper.DeleteProduct)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/categories/{category_id}/products/{product_id}", wrapper.GetProductByID)
	})
	r.Group(func(r chi.Router) {
		r.Put(options.BaseURL+"/categories/{category_id}/products/{product_id}", wrapper.UpdateProduct)
	})
	r.Group(func(r chi.Router) {
		r.Put(options.BaseURL+"/categories/{category_id}/products/{product_id}/set-position", wrapper.SetProductPosition)
	})

	return r
}
