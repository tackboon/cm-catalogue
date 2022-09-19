export enum PRODUCT_ACTION_TYPES {
  SET_IS_PRODUCT_LOADING = "product/SET_IS_PRODUCT_LOADING",
  SET_STATUS_FILTER = "product/SET_STATUS_FILTER",
  SET_CATEGORY_ID = "product/SET_CATEGORY_ID",
  RESET_PRODUCT_ERROR = "product/RESET_PRODUCT_ERROR",
  RESET_PRODCUT_LIST = "product/RESET_PRODCUT_LIST",
  RESET_PRODUCT_FILTER = "product/RESET_PRODUCT_FILTER",
  ADD_PRODUCT_START = "product/ADD_PRODUCT_START",
  ADD_PRODUCT_SUCCESS = "product/ADD_PRODUCT_SUCCESS",
  ADD_PRODUCT_FAILED = "product/ADD_PRODUCT_FAILED",
  UPDATE_PRODUCT_START = "product/UPDATE_PRODUCT_START",
  UPDATE_PRODUCT_SUCCESS = "product/UPDATE_PRODUCT_SUCCESS",
  UPDATE_PRODUCT_FAILED = "product/UPDATE_PRODUCT_FAILED",
  DELETE_PRODUCT_START = "product/DELETE_PRODUCT_START",
  DELETE_PRODUCT_SUCCESS = "product/DELETE_PRODUCT_SUCCESS",
  DELETE_PRODUCT_FAILED = "product/DELETE_PRODUCT_FAILED",
  SEARCH_PRODUCT_START = "product/SEARCH_PRODUCT_START",
  FETCH_ALL_PRODUCT_START = "product/FETCH_ALL_PRODUCT_START",
  FETCH_ALL_PRODUCT_SUCCESS = "product/FETCH_ALL_PRODUCT_SUCCESS",
  FETCH_ALL_PRODUCT_FAILED = "product/FETCH_ALL_PRODUCT_FAILED",
  SET_PRODUCT_POSITION = "product/SET_PRODUCT_POSITION",
}

export enum PRODUCT_STATUS_TYPE {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
}

export enum PRODUCT_LOADING_TYPE {
  ADD_PRODUCT = "loading/add_product",
  UPDATE_PRODUCT = "loading/update_product",
  DELETE_PRODUCT = "loading/delete_product",
  FETCH_ALL_PRODUCT = "loading/fetch_all_product",
}

export enum PRODUCT_ERROR_TYPE {
  ADD_PRODUCT = "error/add_product",
  UPDATE_PRODUCT = "error/update_product",
  DELETE_PRODUCT = "error/delete_product",
  FETCH_ALL_PRODUCT = "error/fetch_all_product",
}

export enum SELECT_PRODUCT_STATUS {
  ALL = "all",
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
}

export type ProductData = {
  id: number;
  name: string;
  description: string;
  price: number;
  status: PRODUCT_STATUS_TYPE;
  file_ids: string[] | null;
  position: number;
  preview_id: string;
};

export type ProductPagination = {
  startPosition: number;
  limit: number;
  isLastPage: boolean;
};
