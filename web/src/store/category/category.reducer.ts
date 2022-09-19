import { AnyAction } from "@reduxjs/toolkit";
import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  addCategoryFailed,
  addCategorySuccess,
  deleteCategoryFailed,
  deleteCategorySuccess,
  fetchAllCategoriesFailed,
  fetchAllCategoriesSuccess,
  resetCategoryError,
  setIsCategoryLoading,
  updateCategoryFailed,
  updateCategorySuccess,
} from "./category.action";
import {
  CategoryData,
  CATEGORY_ERROR_TYPES,
  CATEGORY_LOADING_TYPES,
} from "./category.types";

export type CategoryState = {
  readonly categories: CategoryData[];
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: CategoryState = {
  categories: [],
  isLoading: initLoadingState(CATEGORY_LOADING_TYPES),
  error: initErrorState(CATEGORY_ERROR_TYPES),
};

export const categoryReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): CategoryState => {
  if (setIsCategoryLoading.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [action.payload.type]: action.payload.status,
      },
    };
  }

  if (resetCategoryError.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [action.payload]: "",
      },
    };
  }

  if (addCategorySuccess.match(action)) {
    return {
      ...state,
      categories: [...state.categories, action.payload],
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.ADD_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.ADD_CATEGORY]: "",
      },
    };
  }

  if (addCategoryFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.ADD_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.ADD_CATEGORY]: action.payload,
      },
    };
  }

  if (updateCategorySuccess.match(action)) {
    return {
      ...state,
      categories: state.categories.map((c) => {
        if (c.id === action.payload.id) {
          return action.payload;
        }
        return c;
      }),
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.UPDATE_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.UPDATE_CATEGORY]: "",
      },
    };
  }

  if (updateCategoryFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.UPDATE_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.UPDATE_CATEGORY]: action.payload,
      },
    };
  }

  if (deleteCategorySuccess.match(action)) {
    return {
      ...state,
      categories: state.categories.filter((c) => c.id !== action.payload),
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.DELETE_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.DELETE_CATEGORY]: "",
      },
    };
  }

  if (deleteCategoryFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.DELETE_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.DELETE_CATEGORY]: action.payload,
      },
    };
  }

  if (fetchAllCategoriesSuccess.match(action)) {
    return {
      ...state,
      categories: action.payload,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.FETCH_ALL_CATEGORIES]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.FETCH_ALL_CATEGORIES]: "",
      },
    };
  }

  if (fetchAllCategoriesFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.FETCH_ALL_CATEGORIES]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.FETCH_ALL_CATEGORIES]: action.payload,
      },
    };
  }

  return state;
};
