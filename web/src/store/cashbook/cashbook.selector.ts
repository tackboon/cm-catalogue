import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { CashBookState } from "./cashbook.reducer";

export const selectCashBookReducer = (state: RootState): CashBookState =>
  state.cashbook;

export const selectCashBookRecords = createSelector(
  selectCashBookReducer,
  (cashbook) => cashbook.records
);

export const selectCashBookIsLoading = createSelector(
  selectCashBookReducer,
  (cashbook) => cashbook.isLoading
);

export const selectCashBookError = createSelector(
  selectCashBookReducer,
  (cashbook) => cashbook.error
);
