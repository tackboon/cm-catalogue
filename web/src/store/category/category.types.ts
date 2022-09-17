export enum CATEGORY_ACTION_TYPES {
  SET_IS_CATEGORY_LOADING = "category/SET_IS_CATEGORY_LOADING",
  RESET_CATEGORY_ERROR = "category/RESET_CATEGORY_ERROR",
  ADD_CATEGORY_START = "category/ADD_CATEGORY_START",
  ADD_CATEGORY_SUCCESS = "category/ADD_CATEGORY_SUCCESS",
  ADD_CATEGORY_FAILED = "category/ADD_CATEGORY_FAILED",
  DELETE_CATEGORY_START = "category/DELETE_CATEGORY_START",
  DELETE_CATEGORY_SUCCESS = "category/DELETE_CATEGORY_SUCCESS",
  DELETE_CATEGORY_FAILED = "category/DELETE_CATEGORY_FAILED",
  FETCH_ALL_CATEGORIES_START = "category/FETCH_ALL_CATEGORIES_START",
  FETCH_ALL_CATEGORIES_SUCCESS = "category/FETCH_ALL_CATEGORIES_SUCCESS",
  FETCH_ALL_CATEGORIES_FAILED = "category/FETCH_ALL_CATEGORIES_FAILED",
  UPDATE_CATEGORY_START = "category/UPDATE_CATEGORY_START",
  UPDATE_CATEGORY_SUCCESS = "category/UPDATE_CATEGORY_SUCCESS",
  UPDATE_CATEGORY_FAILED = "category/UPDATE_CATEGORY_FAILED",
}

export enum CATEGORY_LOADING_TYPES {
  ADD_CATEGORY = "loading/add_category",
  DELETE_CATEGORY = "loading/delete_category",
  FETCH_ALL_CATEGORIES = "loading/fetch_all_categories",
  UPDATE_CATEGORY = "loading/update_category",
}

export enum CATEGORY_ERROR_TYPES {
  ADD_CATEGORY = "error/add_category",
  DELETE_CATEGORY = "error/delete_category",
  FETCH_ALL_CATEGORIES = "error/fetch_all_categories",
  UPDATE_CATEGORY = "error/update_category",
}

export type CategoryData = {
  id: number;
  name: string;
  file_id: string;
};
