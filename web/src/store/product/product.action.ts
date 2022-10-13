import { ProductPost } from "../../openapi/catalogue";
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import {
  ProductData,
  PRODUCT_ACTION_TYPES,
  PRODUCT_ERROR_TYPE,
  PRODUCT_LOADING_TYPE,
  SELECT_PRODUCT_STATUS,
} from "./product.types";

export type SetIsProductLoading = ActionWithPayload<
  PRODUCT_ACTION_TYPES.SET_IS_PRODUCT_LOADING,
  {
    type: PRODUCT_LOADING_TYPE;
    status: boolean;
  }
>;

export type SetStatusFilter = ActionWithPayload<
  PRODUCT_ACTION_TYPES.SET_STATUS_FILTER,
  SELECT_PRODUCT_STATUS
>;

export type SetCategoryID = ActionWithPayload<
  PRODUCT_ACTION_TYPES.SET_CATEGORY_ID,
  number
>;

export type ResetProductError = ActionWithPayload<
  PRODUCT_ACTION_TYPES.RESET_PRODUCT_ERROR,
  PRODUCT_ERROR_TYPE
>;

export type ResetProductList = Action<PRODUCT_ACTION_TYPES.RESET_PRODCUT_LIST>;

export type ResetProductFilter =
  Action<PRODUCT_ACTION_TYPES.RESET_PRODUCT_FILTER>;

export type AddProductStart = ActionWithPayload<
  PRODUCT_ACTION_TYPES.ADD_PRODUCT_START,
  {
    categoryID: number;
    product: ProductPost;
  }
>;

export type AddProductSuccess = ActionWithPayload<
  PRODUCT_ACTION_TYPES.ADD_PRODUCT_SUCCESS,
  number
>;

export type AddProductFailed = ActionWithPayload<
  PRODUCT_ACTION_TYPES.ADD_PRODUCT_FAILED,
  string
>;

export type UpdateProductStart = ActionWithPayload<
  PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_START,
  {
    categoryID: number;
    productID: number;
    product: ProductPost;
  }
>;

export type UpdateProductSuccess = ActionWithPayload<
  PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_SUCCESS,
  { product: ProductData; changeCategory: boolean }
>;

export type UpdateProductFailed = ActionWithPayload<
  PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_FAILED,
  string
>;

export type DeleteProductStart = ActionWithPayload<
  PRODUCT_ACTION_TYPES.DELETE_PRODUCT_START,
  {
    categoryID: number;
    productID: number;
  }
>;

export type DeleteProductSuccess = ActionWithPayload<
  PRODUCT_ACTION_TYPES.DELETE_PRODUCT_SUCCESS,
  number
>;

export type DeleteProductFailed = ActionWithPayload<
  PRODUCT_ACTION_TYPES.DELETE_PRODUCT_FAILED,
  string
>;

export type SearchProductStart = ActionWithPayload<
  PRODUCT_ACTION_TYPES.SEARCH_PRODUCT_START,
  string
>;

export type FetchAllProductStart =
  Action<PRODUCT_ACTION_TYPES.FETCH_ALL_PRODUCT_START>;

export type FetchAllProductSuccess = ActionWithPayload<
  PRODUCT_ACTION_TYPES.FETCH_ALL_PRODUCT_SUCCESS,
  {
    products: ProductData[];
    startPosition: number;
    isLastPage: boolean;
  }
>;

export type FetchAllProductFailed = ActionWithPayload<
  PRODUCT_ACTION_TYPES.FETCH_ALL_PRODUCT_FAILED,
  string
>;

export type SetProductPosition = ActionWithPayload<
  PRODUCT_ACTION_TYPES.SET_PRODUCT_POSITION,
  {
    id: number;
    position: number;
  }
>;

export const setIsProductLoading = withMatcher(
  (type: PRODUCT_LOADING_TYPE, status: boolean): SetIsProductLoading =>
    createAction(PRODUCT_ACTION_TYPES.SET_IS_PRODUCT_LOADING, {
      type,
      status,
    })
);

export const setStatusFilter = withMatcher(
  (status: SELECT_PRODUCT_STATUS): SetStatusFilter =>
    createAction(PRODUCT_ACTION_TYPES.SET_STATUS_FILTER, status)
);

export const setCategoryID = withMatcher(
  (categoryID: number): SetCategoryID =>
    createAction(PRODUCT_ACTION_TYPES.SET_CATEGORY_ID, categoryID)
);

export const resetProductError = withMatcher(
  (type: PRODUCT_ERROR_TYPE): ResetProductError =>
    createAction(PRODUCT_ACTION_TYPES.RESET_PRODUCT_ERROR, type)
);

export const resetProductList = withMatcher(
  (): ResetProductList => createAction(PRODUCT_ACTION_TYPES.RESET_PRODCUT_LIST)
);

export const resetProductFilter = withMatcher(
  (): ResetProductFilter =>
    createAction(PRODUCT_ACTION_TYPES.RESET_PRODUCT_FILTER)
);

export const addProductStart = withMatcher(
  (categoryID: number, product: ProductPost): AddProductStart =>
    createAction(PRODUCT_ACTION_TYPES.ADD_PRODUCT_START, {
      categoryID,
      product,
    })
);

export const addProductSuccess = withMatcher(
  (categoryID: number): AddProductSuccess =>
    createAction(PRODUCT_ACTION_TYPES.ADD_PRODUCT_SUCCESS, categoryID)
);

export const addProductFailed = withMatcher(
  (error: string): AddProductFailed =>
    createAction(PRODUCT_ACTION_TYPES.ADD_PRODUCT_FAILED, error)
);

export const updateProductStart = withMatcher(
  (
    categoryID: number,
    productID: number,
    product: ProductPost
  ): UpdateProductStart =>
    createAction(PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_START, {
      categoryID,
      productID,
      product,
    })
);

export const updateProductSuccess = withMatcher(
  (product: ProductData, changeCategory: boolean): UpdateProductSuccess =>
    createAction(PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_SUCCESS, {
      product,
      changeCategory,
    })
);

export const updateProductFailed = withMatcher(
  (error: string): UpdateProductFailed =>
    createAction(PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_FAILED, error)
);

export const deleteProductStart = withMatcher(
  (categoryID: number, productID: number): DeleteProductStart =>
    createAction(PRODUCT_ACTION_TYPES.DELETE_PRODUCT_START, {
      categoryID,
      productID,
    })
);

export const deleteProductSuccess = withMatcher(
  (productID: number): DeleteProductSuccess =>
    createAction(PRODUCT_ACTION_TYPES.DELETE_PRODUCT_SUCCESS, productID)
);

export const deleteProductFailed = withMatcher(
  (error: string): DeleteProductFailed =>
    createAction(PRODUCT_ACTION_TYPES.DELETE_PRODUCT_FAILED, error)
);

export const searchProductStart = withMatcher(
  (filter: string): SearchProductStart =>
    createAction(PRODUCT_ACTION_TYPES.SEARCH_PRODUCT_START, filter)
);

export const fetchAllProductStart = withMatcher(
  (): FetchAllProductStart =>
    createAction(PRODUCT_ACTION_TYPES.FETCH_ALL_PRODUCT_START)
);

export const fetchAllProductSuccess = withMatcher(
  (
    products: ProductData[],
    startPosition: number,
    isLastPage: boolean
  ): FetchAllProductSuccess =>
    createAction(PRODUCT_ACTION_TYPES.FETCH_ALL_PRODUCT_SUCCESS, {
      products,
      startPosition,
      isLastPage,
    })
);

export const fetchAllProductFailed = withMatcher(
  (error: string): FetchAllProductFailed =>
    createAction(PRODUCT_ACTION_TYPES.FETCH_ALL_PRODUCT_FAILED, error)
);

export const setProductPosition = withMatcher(
  (id: number, position: number): SetProductPosition =>
    createAction(PRODUCT_ACTION_TYPES.SET_PRODUCT_POSITION, { id, position })
);
