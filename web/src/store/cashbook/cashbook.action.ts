import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import {
  CashBookRecordData,
  CASH_BOOK_ACTION_TYPES,
  CASH_BOOK_LOADING_TYPES,
  CASH_BOOK_RECORD_TYPES,
} from "./cashbook.types";

export type SetIsCashBookLoading = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.SET_IS_CASH_BOOK_LOADING,
  {
    type: CASH_BOOK_LOADING_TYPES;
    status: boolean;
  }
>;

export type AddCashBookRecordStart = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_START,
  {
    customerID: number;
    date: Date;
    type: CASH_BOOK_RECORD_TYPES;
    amount: number;
    description: string;
  }
>;

export type AddCashBookRecordSuccess =
  Action<CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_SUCCESS>;

export type AddCashBookRecordFailed = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_FAILED,
  string
>;

export type DeleteCashBookRecordStart = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.DELETE_CASH_BOOK_RECORD_START,
  {
    customerID: number;
    recordID: number;
    type: CASH_BOOK_RECORD_TYPES;
    amount: number;
  }
>;

export type DeleteCashBookRecordSuccess = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.DELETE_CASH_BOOK_RECORD_SUCCESS,
  number
>;

export type DeleteCashBookRecordFailed = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.DELETE_CASH_BOOK_RECORD_FAILED,
  string
>;

export type FetchCashBookRecordStart = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.FETCH_CASH_BOOK_RECORD_START,
  {
    customerID: number;
    start: Date;
    end: Date;
  }
>;

export type FetchCashBookRecordSuccess = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.FETCH_CASH_BOOK_RECORD_SUCCESS,
  CashBookRecordData[]
>;

export type FetchCashBookRecordFailed = ActionWithPayload<
  CASH_BOOK_ACTION_TYPES.FETCH_CASH_BOOK_RECORD_FAILED,
  string
>;

export const setIsCashBookLoading = withMatcher(
  (type: CASH_BOOK_LOADING_TYPES, status: boolean): SetIsCashBookLoading =>
    createAction(CASH_BOOK_ACTION_TYPES.SET_IS_CASH_BOOK_LOADING, {
      type,
      status,
    })
);

export const addCashBookRecordStart = withMatcher(
  (
    customerID: number,
    date: Date,
    type: CASH_BOOK_RECORD_TYPES,
    amount: number,
    description: string
  ): AddCashBookRecordStart =>
    createAction(CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_START, {
      customerID,
      date,
      type,
      amount,
      description,
    })
);

export const addCashBookRecordSuccess = withMatcher(
  (): AddCashBookRecordSuccess =>
    createAction(CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_SUCCESS)
);

export const addCashBookRecordFailed = withMatcher(
  (error: string): AddCashBookRecordFailed =>
    createAction(CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_FAILED, error)
);

export const deleteCashBookRecordStart = withMatcher(
  (
    customerID: number,
    recordID: number,
    type: CASH_BOOK_RECORD_TYPES,
    amount: number
  ): DeleteCashBookRecordStart =>
    createAction(CASH_BOOK_ACTION_TYPES.DELETE_CASH_BOOK_RECORD_START, {
      customerID,
      recordID,
      type,
      amount,
    })
);

export const deleteCashBookRecordSuccess = withMatcher(
  (recordID: number): DeleteCashBookRecordSuccess =>
    createAction(
      CASH_BOOK_ACTION_TYPES.DELETE_CASH_BOOK_RECORD_SUCCESS,
      recordID
    )
);

export const deleteCashBookRecordFailed = withMatcher(
  (error: string): DeleteCashBookRecordFailed =>
    createAction(CASH_BOOK_ACTION_TYPES.DELETE_CASH_BOOK_RECORD_FAILED, error)
);

export const fetchCashBookRecordStart = withMatcher(
  (customerID: number, start: Date, end: Date): FetchCashBookRecordStart =>
    createAction(CASH_BOOK_ACTION_TYPES.FETCH_CASH_BOOK_RECORD_START, {
      customerID,
      start,
      end,
    })
);

export const fetchCashBookRecordSuccess = withMatcher(
  (records: CashBookRecordData[]): FetchCashBookRecordSuccess =>
    createAction(CASH_BOOK_ACTION_TYPES.FETCH_CASH_BOOK_RECORD_SUCCESS, records)
);

export const fetchCashBookRecordFailed = withMatcher(
  (error: string): FetchCashBookRecordFailed =>
    createAction(CASH_BOOK_ACTION_TYPES.FETCH_CASH_BOOK_RECORD_FAILED, error)
);
