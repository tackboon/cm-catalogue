package port

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/sirupsen/logrus"
	"github.com/tackboon/cm-catalogue/internal/catalogue/app"
	catalogue "github.com/tackboon/cm-catalogue/internal/catalogue/domain"
	"github.com/tackboon/cm-catalogue/internal/common/auth"
	"github.com/tackboon/cm-catalogue/internal/common/server/httperr"
)

type HTTPServer struct {
	categoryService app.CategoryService
	productService  app.ProductService
}

func NewHttpServer(categoryService app.CategoryService, productService app.ProductService) HTTPServer {
	return HTTPServer{
		categoryService: categoryService,
		productService:  productService,
	}
}

func (h HTTPServer) CreateCategory(w http.ResponseWriter, r *http.Request) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	categoryPost := CategoryPost{}
	if err := render.Decode(r, &categoryPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	category := catalogue.Category{}
	category.Name = categoryPost.Name
	if categoryPost.FileId == nil {
		category.FileID = ""
	} else {
		category.FileID = *categoryPost.FileId
	}

	newID, err := h.categoryService.CreateNewCategory(r.Context(), category)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.GetCategoryByID(w, r, newID)
}

func (h HTTPServer) UpdateCategory(w http.ResponseWriter, r *http.Request, categoryId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	categoryPost := CategoryPost{}
	if err := render.Decode(r, &categoryPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	category := catalogue.Category{}
	category.ID = categoryId
	category.Name = categoryPost.Name
	if categoryPost.FileId == nil {
		category.FileID = ""
	} else {
		category.FileID = *categoryPost.FileId
	}

	err = h.categoryService.UpdateCategoryByID(r.Context(), category)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.GetCategoryByID(w, r, categoryId)
}

func (h HTTPServer) DeleteCategory(w http.ResponseWriter, r *http.Request, categoryId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	err = h.categoryService.DeleteCategoryByID(r.Context(), categoryId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h HTTPServer) GetCategoryByID(w http.ResponseWriter, r *http.Request, categoryId int) {
	appCategory, err := h.categoryService.GetCategoryByID(r.Context(), categoryId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := appCategoryToResponse(appCategory)
	render.Respond(w, r, res)
}

func (h HTTPServer) GetAllCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.categoryService.GetAllCategories(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := Categories{
		Categories: appCategoriesToResponse(categories),
	}

	render.Respond(w, r, res)
}

func (h HTTPServer) CreateProduct(w http.ResponseWriter, r *http.Request, categoryId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	productPost := ProductPost{}
	if err := render.Decode(r, &productPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	var productStatusType catalogue.ProductStatusType
	if string(productPost.Status) == string(catalogue.InStock) {
		productStatusType = catalogue.InStock
	} else if string(productPost.Status) == string(catalogue.OutOfStock) {
		productStatusType = catalogue.OutOfStock
	}

	product := catalogue.Product{
		CategoryID:  categoryId,
		Name:        productPost.Name,
		Description: productPost.Description,
		Price:       productPost.Price,
		Status:      productStatusType,
	}

	if productPost.FileIds != nil {
		product.FileIDs = *productPost.FileIds
	}

	if productPost.PreviewId != nil {
		product.PreviewID = *productPost.PreviewId
	}

	newID, err := h.productService.CreateNewProduct(r.Context(), product)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.GetProductByID(w, r, categoryId, newID)
}

func (h HTTPServer) UpdateProduct(w http.ResponseWriter, r *http.Request, categoryId int, productId int, params UpdateProductParams) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	productPost := ProductPost{}
	if err := render.Decode(r, &productPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	var productStatusType catalogue.ProductStatusType
	if string(productPost.Status) == string(catalogue.InStock) {
		productStatusType = catalogue.InStock
	} else if string(productPost.Status) == string(catalogue.OutOfStock) {
		productStatusType = catalogue.OutOfStock
	}

	cID := categoryId
	changeCategory := false
	if params.NewCategoryId != nil {
		cID = *params.NewCategoryId
		if cID != categoryId {
			changeCategory = true
		}
	}

	product := catalogue.Product{
		ID:          productId,
		CategoryID:  cID,
		Name:        productPost.Name,
		Description: productPost.Description,
		Price:       productPost.Price,
		Status:      productStatusType,
	}

	if productPost.FileIds != nil {
		product.FileIDs = *productPost.FileIds
	}

	if productPost.PreviewId != nil {
		product.PreviewID = *productPost.PreviewId
	}

	err = h.productService.UpdateProductByID(r.Context(), product, changeCategory)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.GetProductByID(w, r, categoryId, productId)
}

func (h HTTPServer) DeleteProduct(w http.ResponseWriter, r *http.Request, categoryId int, productId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	err = h.productService.DeleteProdcutByID(r.Context(), productId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h HTTPServer) GetProductByID(w http.ResponseWriter, r *http.Request, categoryId int, productId int) {
	appProduct, err := h.productService.GetProductByID(r.Context(), productId)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := appProductToResponse(appProduct)
	render.Respond(w, r, res)
}

func (h HTTPServer) GetAllCategoryProducts(w http.ResponseWriter, r *http.Request, categoryId int, params GetAllCategoryProductsParams) {
	startPosition := float64(0)
	limit := 0
	filter := ""
	statusFilter := catalogue.AllFilter

	if params.StartPosition != nil {
		startPosition = *params.StartPosition
	}

	if params.Limit != nil {
		limit = *params.Limit
	}

	if params.Filter != nil {
		filter = *params.Filter
	}

	if params.StatusFilter != nil {
		if string(*params.StatusFilter) == string(catalogue.InStockFilter) {
			statusFilter = catalogue.InStockFilter
		} else if string(*params.StatusFilter) == string(catalogue.OutOfStockFilter) {
			statusFilter = catalogue.OutOfStockFilter
		}
	}

	products, err := h.productService.GetAllProducts(
		r.Context(),
		categoryId,
		startPosition,
		limit,
		filter,
		statusFilter,
	)
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	res := CategoryProducts{
		Data: appProductsToResponse(products),
	}

	render.Respond(w, r, res)
}

func (h HTTPServer) SetProductPosition(w http.ResponseWriter, r *http.Request, categoryId int, productId int) {
	user, err := auth.UserFromCtx(r.Context())
	if err != nil {
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	if user.Role != "admin" {
		httperr.Unauthorised("invalid-role", nil, w, r)
		return
	}

	type productPositionRequest struct {
		Position float64 `json:"position"`
	}

	productPositionPost := productPositionRequest{}
	if err := render.Decode(r, &productPositionPost); err != nil {
		httperr.BadRequest("invalid-request", err, w, r)
		return
	}

	err = h.productService.SetProductPosition(r.Context(), productId, productPositionPost.Position)
	if err != nil {
		logrus.Debug(err)
		httperr.RespondWithSlugError(err, w, r)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func appCategoryToResponse(appCategory catalogue.Category) Category {
	var category Category

	category.Id = appCategory.ID
	category.Name = appCategory.Name
	category.FileId = appCategory.FileID

	return category
}

func appCategoriesToResponse(appCategories []catalogue.Category) []Category {
	var categories []Category

	for _, item := range appCategories {
		c := appCategoryToResponse(item)
		categories = append(categories, c)
	}

	return categories
}

func appProductToResponse(appProduct catalogue.Product) Product {
	product := Product{
		Id:          appProduct.ID,
		Name:        appProduct.Name,
		Description: appProduct.Description,
		Price:       appProduct.Price,
		Status:      string(appProduct.Status),
		Position:    appProduct.Position,
		PreviewId:   appProduct.PreviewID,
		FileIds:     appProduct.FileIDs,
	}

	return product
}

func appProductsToResponse(appProducts []catalogue.Product) []Product {
	var products []Product

	for _, item := range appProducts {
		p := appProductToResponse(item)
		products = append(products, p)
	}

	return products
}
