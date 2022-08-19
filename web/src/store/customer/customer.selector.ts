import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { CustomerState } from "./customer.reducer";

export const selectCustomerReducer = (state: RootState): CustomerState =>
  state.customer;

export const selectCustomers = createSelector(
  selectCustomerReducer,
  (customer) => customer.customers
);

export const selectCustomerError = createSelector(
  selectCustomerReducer,
  (customer) => customer.error
);

export const selectCustomerIsLoading = createSelector(
  selectCustomerReducer,
  (customer) => customer.isLoading
);

export const selectCustomerPagination = createSelector(
  selectCustomerReducer,
  (customer) => customer.pagination
);

export const selectCustomerFilter = createSelector(
  selectCustomerReducer,
  (customer) => customer.filter
);

export const selectCustomerRelationshipFilter = createSelector(
  selectCustomerReducer,
  (customer) => customer.relationshipFilter
);
