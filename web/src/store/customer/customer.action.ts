import { CustomerPost } from "../../openapi/customer";
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import { CustomerPagination } from "./customer.types";
import {
  CustomerData,
  CUSTOMER_ACTION_TYPES,
  CUSTOMER_ERROR_TYPES,
  CUSTOMER_LOADING_TYPES,
  SELECT_CUSTOMER_RELATIONSHIP,
} from "./customer.types";

export type SetIsCustomerLoading = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.SET_IS_CUSTOMER_LOADING,
  { type: CUSTOMER_LOADING_TYPES; isLoading: boolean }
>;

export type ResetCustomerError = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.RESET_CUSTOMER_ERROR,
  CUSTOMER_ERROR_TYPES
>;

export type SetRelationshipFilter = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.SET_RELATIONSHIP_FILTER,
  SELECT_CUSTOMER_RELATIONSHIP
>;

export type SearchCustomerStart = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.SEARCH_CUSTOMER_START,
  { page: number; filter: string }
>;

export type FetchAllCustomerDataStart =
  Action<CUSTOMER_ACTION_TYPES.FETCH_ALL_CUSTOMER_DATA_START>;

export type FetchAllCustomerDataSuccess = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.FETCH_ALL_CUSTOMER_DATA_SUCCESS,
  {
    customers: CustomerData[];
    pagination: CustomerPagination;
  }
>;

export type FetchAllCustomerDataFailed = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.FETCH_ALL_CUSTOMER_DATA_FAILED,
  string
>;

export type CreateCustomerDataStart = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_START,
  {
    data: CustomerPost;
  }
>;

export type CreateCustomerDataSuccess =
  Action<CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_SUCCESS>;

export type CreateCustomerDataFailed = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_FAILED,
  string
>;

export type UpdateCustomerDataStart = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.UPDATE_CUSTOMER_DATA_START,
  { customerID: number; data: CustomerPost }
>;

export type UpdateCustomerDataSuccess =
  Action<CUSTOMER_ACTION_TYPES.UPDATE_CUSTOMER_DATA_SUCCESS>;

export type UpdateCustomerDataFailed = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.UPDATE_CUSTOMER_DATA_FAILED,
  string
>;

export type DeleteCustomerDataStart = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_START,
  number
>;

export type DeleteCustomerDataSuccess =
  Action<CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_SUCCESS>;

export type DeleteCustomerDataFailed = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_FAILED,
  string
>;

export type SetCustomerTotalUnbilledAmount = ActionWithPayload<
  CUSTOMER_ACTION_TYPES.SET_CUSTOEMR_TOTAL_UNBILLED_AMOUNT,
  {
    customerID: number;
    amount: number;
  }
>;

export const setIsCustomerLoading = withMatcher(
  (type: CUSTOMER_LOADING_TYPES, isLoading: boolean): SetIsCustomerLoading =>
    createAction(CUSTOMER_ACTION_TYPES.SET_IS_CUSTOMER_LOADING, {
      type,
      isLoading,
    })
);

export const resetCustomerError = withMatcher(
  (type: CUSTOMER_ERROR_TYPES): ResetCustomerError =>
    createAction(CUSTOMER_ACTION_TYPES.RESET_CUSTOMER_ERROR, type)
);

export const setRelationshipFilter = withMatcher(
  (value: SELECT_CUSTOMER_RELATIONSHIP): SetRelationshipFilter =>
    createAction(CUSTOMER_ACTION_TYPES.SET_RELATIONSHIP_FILTER, value)
);

export const searchCustomerStart = withMatcher(
  (page: number, filter: string): SearchCustomerStart =>
    createAction(CUSTOMER_ACTION_TYPES.SEARCH_CUSTOMER_START, {
      page,
      filter,
    })
);

export const fetchAllCustomerDataStart = withMatcher(
  (): FetchAllCustomerDataStart =>
    createAction(CUSTOMER_ACTION_TYPES.FETCH_ALL_CUSTOMER_DATA_START)
);

export const fetchAllCustomerDataSuccess = withMatcher(
  (
    customers: CustomerData[],
    pagination: CustomerPagination
  ): FetchAllCustomerDataSuccess =>
    createAction(CUSTOMER_ACTION_TYPES.FETCH_ALL_CUSTOMER_DATA_SUCCESS, {
      customers,
      pagination,
    })
);

export const fetchAllCustomerDataFailed = withMatcher(
  (error: string): FetchAllCustomerDataFailed =>
    createAction(CUSTOMER_ACTION_TYPES.FETCH_ALL_CUSTOMER_DATA_FAILED, error)
);

export const createCustomerDataStart = withMatcher(
  (data: CustomerPost): CreateCustomerDataStart =>
    createAction(CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_START, {
      data,
    })
);

export const createCustomerDataSuccess = withMatcher(
  (): CreateCustomerDataSuccess =>
    createAction(CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_SUCCESS)
);

export const createCustomerDataFailed = withMatcher(
  (error: string): CreateCustomerDataFailed =>
    createAction(CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_FAILED, error)
);

export const updateCustomerDataStart = withMatcher(
  (customerID: number, data: CustomerPost): UpdateCustomerDataStart =>
    createAction(CUSTOMER_ACTION_TYPES.UPDATE_CUSTOMER_DATA_START, {
      customerID,
      data,
    })
);

export const updateCustomerDataSuccess = withMatcher(
  (): UpdateCustomerDataSuccess =>
    createAction(CUSTOMER_ACTION_TYPES.UPDATE_CUSTOMER_DATA_SUCCESS)
);

export const updateCustomerDataFailed = withMatcher(
  (error: string): UpdateCustomerDataFailed =>
    createAction(CUSTOMER_ACTION_TYPES.UPDATE_CUSTOMER_DATA_FAILED, error)
);

export const deleteCustomerDataStart = withMatcher(
  (customerID: number): DeleteCustomerDataStart =>
    createAction(CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_START, customerID)
);

export const deleteCustomerDataSuccess = withMatcher(
  (): DeleteCustomerDataSuccess =>
    createAction(CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_SUCCESS)
);

export const deleteCustomerDataFailed = withMatcher(
  (error: string): DeleteCustomerDataFailed =>
    createAction(CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_FAILED, error)
);

export const setCustomerTotalUnbilledAmount = withMatcher(
  (customerID: number, amount: number): SetCustomerTotalUnbilledAmount =>
    createAction(CUSTOMER_ACTION_TYPES.SET_CUSTOEMR_TOTAL_UNBILLED_AMOUNT, {
      customerID,
      amount,
    })
);
