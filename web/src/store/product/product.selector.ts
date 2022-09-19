import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { ProductState } from "./product.reducer";

export const selectProductReducer = (state: RootState): ProductState =>
  state.product;

export const selectProducts = createSelector(
  selectProductReducer,
  (product) => product.products
);

export const selectProductIsLoading = createSelector(
  selectProductReducer,
  (product) => product.isLoading
);

export const selectProductError = createSelector(
  selectProductReducer,
  (product) => product.error
);

export const selectProductFilter = createSelector(
  selectProductReducer,
  (product) => product.filter
);

export const selectProductStatusFilter = createSelector(
  selectProductReducer,
  (product) => product.statusFilter
);

export const selectCategoryID = createSelector(
  selectProductReducer,
  (product) => product.categoryID
);

export const selectProductPagination = createSelector(
  selectProductReducer,
  (product) => product.pagination
);
