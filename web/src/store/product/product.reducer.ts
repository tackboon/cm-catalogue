import { AnyAction } from "@reduxjs/toolkit";

import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  addProductFailed,
  addProductSuccess,
  deleteProductFailed,
  deleteProductSuccess,
  fetchAllProductFailed,
  fetchAllProductSuccess,
  resetProductError,
  resetProductFilter,
  resetProductList,
  searchProductStart,
  setCategoryID,
  setIsProductLoading,
  setProductPosition,
  setStatusFilter,
  updateProductFailed,
  updateProductSuccess,
} from "./product.action";
import {
  ProductData,
  ProductPagination,
  PRODUCT_ERROR_TYPE,
  PRODUCT_LOADING_TYPE,
  SELECT_PRODUCT_STATUS,
} from "./product.types";

export type ProductState = {
  readonly categoryID: number;
  readonly products: ProductData[];
  readonly pagination: ProductPagination;
  readonly filter: string;
  readonly statusFilter: SELECT_PRODUCT_STATUS;
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: ProductState = {
  categoryID: 0,
  products: [],
  pagination: {
    startPosition: 0,
    limit: 50,
    isLastPage: false,
  },
  filter: "",
  statusFilter: SELECT_PRODUCT_STATUS.ALL,
  isLoading: initLoadingState(PRODUCT_LOADING_TYPE),
  error: initErrorState(PRODUCT_ERROR_TYPE),
};

export const productReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): ProductState => {
  if (setIsProductLoading.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [action.payload.type]: action.payload.status,
      },
    };
  }

  if (setStatusFilter.match(action)) {
    return {
      ...state,
      statusFilter: action.payload,
      pagination: {
        ...state.pagination,
        startPosition: 0,
        isLastPage: false,
      },
      products: [],
    };
  }

  if (setCategoryID.match(action)) {
    return {
      ...state,
      categoryID: action.payload,
      pagination: {
        ...state.pagination,
        startPosition: 0,
        isLastPage: false,
      },
      products: [],
    };
  }

  if (resetProductError.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [action.payload]: "",
      },
    };
  }

  if (resetProductList.match(action)) {
    return {
      ...state,
      products: [],
      pagination: {
        ...state.pagination,
        startPosition: 0,
        isLastPage: false,
      },
    };
  }

  if (resetProductFilter.match(action)) {
    return {
      ...state,
      filter: "",
    };
  }

  if (addProductSuccess.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.ADD_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPE.ADD_PRODUCT]: "",
      },
    };
  }

  if (addProductFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.ADD_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPE.ADD_PRODUCT]: action.payload,
      },
    };
  }

  if (updateProductSuccess.match(action)) {
    return {
      ...state,
      products: action.payload.changeCategory
        ? state.products.filter((p) => p.id !== action.payload.product.id)
        : state.products.map((p) => {
            if (p.id === action.payload.product.id) {
              return action.payload.product;
            } else {
              return p;
            }
          }),
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.UPDATE_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPE.UPDATE_PRODUCT]: "",
      },
    };
  }

  if (updateProductFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.UPDATE_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPE.UPDATE_PRODUCT]: action.payload,
      },
    };
  }

  if (deleteProductSuccess.match(action)) {
    return {
      ...state,
      products: state.products.filter((p) => p.id !== action.payload),
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.DELETE_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPE.DELETE_PRODUCT]: "",
      },
    };
  }

  if (deleteProductFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.DELETE_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPE.DELETE_PRODUCT]: action.payload,
      },
    };
  }

  if (searchProductStart.match(action)) {
    return {
      ...state,
      filter: action.payload,
      pagination: {
        ...state.pagination,
        startPosition: 0,
        isLastPage: false,
      },
      products: [],
    };
  }

  if (fetchAllProductSuccess.match(action)) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        startPosition: action.payload.startPosition,
        isLastPage: action.payload.isLastPage,
      },
      products: [...state.products, ...action.payload.products],
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.FETCH_ALL_PRODUCT]: false,
      },
    };
  }

  if (fetchAllProductFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPE.FETCH_ALL_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPE.FETCH_ALL_PRODUCT]: action.payload,
      },
    };
  }

  if (setProductPosition.match(action)) {
    return {
      ...state,
      products: state.products.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            position: action.payload.position,
          };
        }
        return product;
      }),
    };
  }

  return state;
};
