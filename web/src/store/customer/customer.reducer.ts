import { AnyAction } from "redux";
import Cookies from "js-cookie";

import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import { CustomerPagination } from "./customer.types";
import {
  createCustomerDataFailed,
  createCustomerDataSuccess,
  deleteCustomerDataFailed,
  deleteCustomerDataSuccess,
  fetchAllCustomerDataFailed,
  fetchAllCustomerDataSuccess,
  resetCustomerError,
  searchCustomerStart,
  setCustomerTotalUnbilledAmount,
  setIsCustomerLoading,
  setRelationshipFilter,
  updateCustomerDataFailed,
  updateCustomerDataSuccess,
} from "./customer.action";
import {
  CustomerData,
  CUSTOMER_ERROR_TYPES,
  CUSTOMER_LOADING_TYPES,
  SELECT_CUSTOMER_RELATIONSHIP,
} from "./customer.types";
import { withEnumGuard } from "../../utils/enum/enum_guard";

export type CustomerState = {
  readonly customers: CustomerData[];
  readonly pagination: CustomerPagination;
  readonly filter: string;
  readonly relationshipFilter: SELECT_CUSTOMER_RELATIONSHIP;
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const cookieRelationshipFilter = Cookies.get("relationship_filter");

const INITIAL_STATE: CustomerState = {
  customers: [],
  pagination: {
    limit: 20,
    count: 0,
    page: 1,
    total_count: 0,
  },
  filter: "",
  relationshipFilter: withEnumGuard(SELECT_CUSTOMER_RELATIONSHIP).check(
    cookieRelationshipFilter
  )
    ? cookieRelationshipFilter
    : SELECT_CUSTOMER_RELATIONSHIP.ALL,
  isLoading: initLoadingState(CUSTOMER_LOADING_TYPES),
  error: initErrorState(CUSTOMER_ERROR_TYPES),
};

export const customerReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): CustomerState => {
  if (setIsCustomerLoading.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [action.payload.type]: action.payload.isLoading,
      },
    };
  }

  if (resetCustomerError.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [action.payload]: "",
      },
    };
  }

  if (setRelationshipFilter.match(action)) {
    Cookies.set("relationship_filter", action.payload);
    return {
      ...state,
      relationshipFilter: action.payload,
    };
  }

  if (searchCustomerStart.match(action)) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        page: action.payload.page,
      },
      filter: action.payload.filter,
    };
  }

  if (fetchAllCustomerDataSuccess.match(action)) {
    return {
      ...state,
      customers: action.payload.customers,
      pagination: action.payload.pagination,
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.FETCH_ALL_CUSTOMER_DATA]: false,
      },
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.FETCH_ALL_CUSTOMER_DATA]: "",
      },
    };
  }

  if (fetchAllCustomerDataFailed.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.FETCH_ALL_CUSTOMER_DATA]: action.payload,
      },
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.FETCH_ALL_CUSTOMER_DATA]: false,
      },
    };
  }

  if (createCustomerDataSuccess.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.CREATE_CUSTOMER_DATA]: "",
      },
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.CREATE_CUSTOMER_DATA]: false,
      },
    };
  }

  if (createCustomerDataFailed.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.CREATE_CUSTOMER_DATA]: action.payload,
      },
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.CREATE_CUSTOMER_DATA]: false,
      },
    };
  }

  if (updateCustomerDataSuccess.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.UPDATE_CUSTOMER_DATA]: "",
      },
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.UPDATE_CUSTOMER_DATA]: false,
      },
    };
  }

  if (updateCustomerDataFailed.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.UPDATE_CUSTOMER_DATA]: action.payload,
      },
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.UPDATE_CUSTOMER_DATA]: false,
      },
    };
  }

  if (deleteCustomerDataSuccess.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.DELETE_CUSTOMER_DATA]: "",
      },
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.DELETE_CUSTOMER_DATA]: false,
      },
    };
  }

  if (deleteCustomerDataFailed.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [CUSTOMER_ERROR_TYPES.DELETE_CUSTOMER_DATA]: action.payload,
      },
      isLoading: {
        ...state.isLoading,
        [CUSTOMER_LOADING_TYPES.DELETE_CUSTOMER_DATA]: false,
      },
    };
  }

  if (setCustomerTotalUnbilledAmount.match(action)) {
    return {
      ...state,
      customers: state.customers.map((c) => {
        if (c.id === action.payload.customerID) {
          c.total_unbilled_amount += action.payload.amount;
        }
        return { ...c };
      }),
    };
  }

  return state;
};
