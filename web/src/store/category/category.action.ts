import { CategoryPost } from "../../openapi/catalogue";
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import {
  CategoryData,
  CATEGORY_ACTION_TYPES,
  CATEGORY_ERROR_TYPES,
  CATEGORY_LOADING_TYPES,
} from "./category.types";

export type SetIsCategoryLoading = ActionWithPayload<
  CATEGORY_ACTION_TYPES.SET_IS_CATEGORY_LOADING,
  {
    type: CATEGORY_LOADING_TYPES;
    status: boolean;
  }
>;

export type ResetCategoryError = ActionWithPayload<
  CATEGORY_ACTION_TYPES.RESET_CATEGORY_ERROR,
  CATEGORY_ERROR_TYPES
>;

export type AddCategoryStart = ActionWithPayload<
  CATEGORY_ACTION_TYPES.ADD_CATEGORY_START,
  CategoryPost
>;

export type AddCategorySuccess = ActionWithPayload<
  CATEGORY_ACTION_TYPES.ADD_CATEGORY_SUCCESS,
  CategoryData
>;

export type AddCategoryFailed = ActionWithPayload<
  CATEGORY_ACTION_TYPES.ADD_CATEGORY_FAILED,
  string
>;

export type FetchAllCategoriesStart =
  Action<CATEGORY_ACTION_TYPES.FETCH_ALL_CATEGORIES_START>;

export type FetchAllCategoriesSuccess = ActionWithPayload<
  CATEGORY_ACTION_TYPES.FETCH_ALL_CATEGORIES_SUCCESS,
  CategoryData[]
>;

export type FetchAllCategoriesFailed = ActionWithPayload<
  CATEGORY_ACTION_TYPES.FETCH_ALL_CATEGORIES_FAILED,
  string
>;

export type UpdateCategoryStart = ActionWithPayload<
  CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_START,
  CategoryData
>;

export type UpdateCategorySuccess = ActionWithPayload<
  CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_SUCCESS,
  CategoryData
>;

export type UpdateCategoryFailed = ActionWithPayload<
  CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_FAILED,
  string
>;

export type DeleteCategoryStart = ActionWithPayload<
  CATEGORY_ACTION_TYPES.DELETE_CATEGORY_START,
  number
>;

export type DeleteCategorySuccess = ActionWithPayload<
  CATEGORY_ACTION_TYPES.DELETE_CATEGORY_SUCCESS,
  number
>;

export type DeleteCategoryFailed = ActionWithPayload<
  CATEGORY_ACTION_TYPES.DELETE_CATEGORY_FAILED,
  string
>;

export const setIsCategoryLoading = withMatcher(
  (type: CATEGORY_LOADING_TYPES, status: boolean): SetIsCategoryLoading =>
    createAction(CATEGORY_ACTION_TYPES.SET_IS_CATEGORY_LOADING, {
      type,
      status,
    })
);

export const resetCategoryError = withMatcher(
  (type: CATEGORY_ERROR_TYPES): ResetCategoryError =>
    createAction(CATEGORY_ACTION_TYPES.RESET_CATEGORY_ERROR, type)
);

export const addCategoryStart = withMatcher(
  (data: CategoryPost): AddCategoryStart =>
    createAction(CATEGORY_ACTION_TYPES.ADD_CATEGORY_START, data)
);

export const addCategorySuccess = withMatcher(
  (data: CategoryData): AddCategorySuccess =>
    createAction(CATEGORY_ACTION_TYPES.ADD_CATEGORY_SUCCESS, data)
);

export const addCategoryFailed = withMatcher(
  (error: string): AddCategoryFailed =>
    createAction(CATEGORY_ACTION_TYPES.ADD_CATEGORY_FAILED, error)
);

export const fetchAllCategoriesStart = withMatcher(
  (): FetchAllCategoriesStart =>
    createAction(CATEGORY_ACTION_TYPES.FETCH_ALL_CATEGORIES_START)
);

export const fetchAllCategoriesSuccess = withMatcher(
  (categories: CategoryData[]): FetchAllCategoriesSuccess =>
    createAction(CATEGORY_ACTION_TYPES.FETCH_ALL_CATEGORIES_SUCCESS, categories)
);

export const fetchAllCategoriesFailed = withMatcher(
  (error: string): FetchAllCategoriesFailed =>
    createAction(CATEGORY_ACTION_TYPES.FETCH_ALL_CATEGORIES_FAILED, error)
);

export const updateCategoryStart = withMatcher(
  (data: CategoryData): UpdateCategoryStart =>
    createAction(CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_START, data)
);

export const updateCategorySuccess = withMatcher(
  (data: CategoryData): UpdateCategorySuccess =>
    createAction(CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_SUCCESS, data)
);

export const updateCategoryFailed = withMatcher(
  (error: string): UpdateCategoryFailed =>
    createAction(CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_FAILED, error)
);

export const deleteCategoryStart = withMatcher(
  (categoryID: number): DeleteCategoryStart =>
    createAction(CATEGORY_ACTION_TYPES.DELETE_CATEGORY_START, categoryID)
);

export const deleteCategorySuccess = withMatcher(
  (categoryID: number): DeleteCategorySuccess =>
    createAction(CATEGORY_ACTION_TYPES.DELETE_CATEGORY_SUCCESS, categoryID)
);

export const deleteCategoryFailed = withMatcher(
  (error: string): DeleteCategoryFailed =>
    createAction(CATEGORY_ACTION_TYPES.DELETE_CATEGORY_FAILED, error)
);
