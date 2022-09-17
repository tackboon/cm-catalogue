export enum CUSTOMER_ACTION_TYPES {
  SET_IS_CUSTOMER_LOADING = "customer/SET_IS_CUSTOMER_LOADING",
  RESET_CUSTOMER_ERROR = "customer/RESET_CUSTOMER_ERROR",
  SET_RELATIONSHIP_FILTER = "customer/SET_RELATIONSHIP_FILTER",
  SEARCH_CUSTOMER_START = "customer/SEARCH_CUSTOMER_START",
  FETCH_ALL_CUSTOMER_DATA_START = "customer/FETCH_ALL_CUSTOMER_DATA_START",
  FETCH_ALL_CUSTOMER_DATA_SUCCESS = "customer/FETCH_ALL_CUSTOMER_DATA_SUCCESS",
  FETCH_ALL_CUSTOMER_DATA_FAILED = "customer/FETCH_ALL_CUSTOMER_DATA_FAILED",
  CREATE_CUSTOMER_DATA_START = "customer/CREATE_CUSTOMER_DATA_START",
  CREATE_CUSTOMER_DATA_SUCCESS = "customer/CREATE_CUSTOMER_DATA_SUCCESS",
  CREATE_CUSTOMER_DATA_FAILED = "customer/CREATE_CUSTOMER_DATA_FAILED",
  UPDATE_CUSTOMER_DATA_START = "customer/UPDATE_CUSTOMER_DATA_START",
  UPDATE_CUSTOMER_DATA_SUCCESS = "customer/UPDATE_CUSTOMER_DATA_SUCCESS",
  UPDATE_CUSTOMER_DATA_FAILED = "customer/UPDATE_CUSTOMER_DATA_FAILED",
  DELETE_CUSTOMER_DATA_SUCCESS = "customer/DELETE_CUSTOMER_DATA_SUCCESS",
  DELETE_CUSTOMER_DATA_START = "customer/DELETE_CUSTOMER_DATA_START",
  DELETE_CUSTOMER_DATA_FAILED = "customer/DELETE_CUSTOMER_DATA_FAILED",
  SET_CUSTOEMR_TOTAL_UNBILLED_AMOUNT = "customer/SET_CUSTOEMR_TOTAL_UNBILLED_AMOUNT",
}

export enum CUSTOMER_LOADING_TYPES {
  FETCH_ALL_CUSTOMER_DATA = "loading/FETCH_ALL_CUSTOMER_DATA",
  CREATE_CUSTOMER_DATA = "loading/CREATE_CUSTOMER_DATA",
  UPDATE_CUSTOMER_DATA = "loading/UPDATE_CUSTOMER_DATA",
  DELETE_CUSTOMER_DATA = "loading/DELETE_CUSTOMER_DATA",
}

export enum CUSTOMER_ERROR_TYPES {
  FETCH_ALL_CUSTOMER_DATA = "error/FETCH_ALL_CUSTOMER-DATA",
  CREATE_CUSTOMER_DATA = "error/CREATE_CUSTOMER_DATA",
  UPDATE_CUSTOMER_DATA = "error/UPDATE_CUSTOMER_DATA",
  DELETE_CUSTOMER_DATA = "error/DELETE_CUSTOMER_DATA",
}

export enum CUSTOMER_RELATIONSHIP {
  IN_COOPERATION = "in_cooperation",
  SUSPENDED = "suspended",
}

export enum SELECT_CUSTOMER_RELATIONSHIP {
  ALL = "all",
  IN_COOPERATION = "in_cooperation",
  SUSPENDED = "suspended",
}

export type CustomerData = {
  id: number;
  code: string;
  name: string;
  contact: string;
  relationship: CUSTOMER_RELATIONSHIP;
  address: string;
  postcode: string;
  city: string;
  state: string;
  total_unbilled_amount: number;
  created_at: Date;
  updated_at: Date;
};

export type CustomerPagination = {
  limit: number;
  count: number;
  page: number;
  total_count: number;
};
