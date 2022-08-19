import { AnyAction } from "@reduxjs/toolkit";
import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  addCashBookRecordFailed,
  addCashBookRecordSuccess,
  deleteCashBookRecordFailed,
  deleteCashBookRecordSuccess,
  fetchCashBookRecordFailed,
  fetchCashBookRecordSuccess,
  setIsCashBookLoading,
} from "./cashbook.action";
import {
  CashBookRecordData,
  CASH_BOOK_ERROR_TYPES,
  CASH_BOOK_LOADING_TYPES,
} from "./cashbook.types";

export type CashBookState = {
  readonly records: CashBookRecordData[];
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: CashBookState = {
  records: [],
  isLoading: initLoadingState(CASH_BOOK_LOADING_TYPES),
  error: initErrorState(CASH_BOOK_ERROR_TYPES),
};

export const cashBookReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): CashBookState => {
  if (setIsCashBookLoading.match(action)) {
    return {
      ...state,
      isLoading: {
        [action.payload.type]: action.payload.status,
      },
    };
  }

  if (addCashBookRecordSuccess.match(action)) {
    return {
      ...state,
      error: {
        [CASH_BOOK_ERROR_TYPES.ADD_CASH_BOOK_RECORD]: "",
      },
      isLoading: { [CASH_BOOK_LOADING_TYPES.ADD_CASH_BOOK_RECORD]: false },
    };
  }

  if (addCashBookRecordFailed.match(action)) {
    return {
      ...state,
      error: { [CASH_BOOK_ERROR_TYPES.ADD_CASH_BOOK_RECORD]: action.payload },
      isLoading: { [CASH_BOOK_LOADING_TYPES.ADD_CASH_BOOK_RECORD]: false },
    };
  }

  if (deleteCashBookRecordSuccess.match(action)) {
    return {
      ...state,
      error: {
        [CASH_BOOK_ERROR_TYPES.DELETE_CASH_BOOK_RECORD]: "",
      },
      isLoading: { [CASH_BOOK_LOADING_TYPES.DELETE_CASH_BOOK_RECORD]: false },
      records: state.records.filter((r) => r.id !== action.payload),
    };
  }

  if (deleteCashBookRecordFailed.match(action)) {
    return {
      ...state,
      error: {
        [CASH_BOOK_ERROR_TYPES.DELETE_CASH_BOOK_RECORD]: action.payload,
      },
      isLoading: { [CASH_BOOK_LOADING_TYPES.DELETE_CASH_BOOK_RECORD]: false },
    };
  }

  if (fetchCashBookRecordSuccess.match(action)) {
    return {
      ...state,
      records: action.payload,
      error: {
        [CASH_BOOK_ERROR_TYPES.FETCH_CASH_BOOK_RECORD]: "",
      },
      isLoading: {
        [CASH_BOOK_LOADING_TYPES.FETCH_CASH_BOOK_RECORD]: false,
      },
    };
  }

  if (fetchCashBookRecordFailed.match(action)) {
    return {
      ...state,
      error: {
        [CASH_BOOK_ERROR_TYPES.FETCH_CASH_BOOK_RECORD]: action.payload,
      },
      isLoading: {
        [CASH_BOOK_LOADING_TYPES.FETCH_CASH_BOOK_RECORD]: false,
      },
    };
  }

  return state;
};
