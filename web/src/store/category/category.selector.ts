import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { CategoryState } from "./category.reducer";

export const selectCategoryReducer = (state: RootState): CategoryState =>
  state.category;

export const selectCategories = createSelector(
  selectCategoryReducer,
  (category) => category.categories
);

export const selectCategorysLoading = createSelector(
  selectCategoryReducer,
  (category) => category.isLoading
);

export const selectCategoryError = createSelector(
  selectCategoryReducer,
  (category) => category.error
);

export const selectCategoryByID = createSelector(
  [selectCategories, (_, categoryID: number) => categoryID],
  (categories, categoryID: number) =>
    categories.filter((category) => category.id === categoryID)
);
