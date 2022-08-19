export enum CASH_BOOK_ACTION_TYPES {
  SET_IS_CASH_BOOK_LOADING = "cashbook/SET_IS_CASH_BOOK_LOADING",
  ADD_CASH_BOOK_RECORD_START = "cashbook/ADD_CASH_BOOK_RECORD_START",
  ADD_CASH_BOOK_RECORD_SUCCESS = "cashbook/ADD_CASH_BOOK_RECORD_SUCCESS",
  ADD_CASH_BOOK_RECORD_FAILED = "cashbook/ADD_CASH_BOOK_RECORD_FAILED",
  DELETE_CASH_BOOK_RECORD_START = "cashbook/DELETE_CASH_BOOK_RECORD_START",
  DELETE_CASH_BOOK_RECORD_SUCCESS = "cashbook/DELETE_CASH_BOOK_RECORD_SUCCESS",
  DELETE_CASH_BOOK_RECORD_FAILED = "cashbook/DELETE_CASH_BOOK_RECORD_FAILED",
  FETCH_CASH_BOOK_RECORD_START = "cashbook/FETCH_CASH_BOOK_RECORD_START",
  FETCH_CASH_BOOK_RECORD_SUCCESS = "cashbook/FETCH_CASH_BOOK_RECORD_SUCCESS",
  FETCH_CASH_BOOK_RECORD_FAILED = "cashbook/FETCH_CASH_BOOK_RECORD_FAILED",
}

export enum CASH_BOOK_RECORD_TYPES {
  DEBIT = "debit",
  CREDIT = "credit",
}

export enum CASH_BOOK_LOADING_TYPES {
  ADD_CASH_BOOK_RECORD = "loading/add_cash_book_record",
  DELETE_CASH_BOOK_RECORD = "loading/delete_cash_book_record",
  FETCH_CASH_BOOK_RECORD = "loading/fetch_cash_book_record",
}

export enum CASH_BOOK_ERROR_TYPES {
  ADD_CASH_BOOK_RECORD = "error/add_cash_book_record",
  DELETE_CASH_BOOK_RECORD = "error/delete_cash_book_record",
  FETCH_CASH_BOOK_RECORD = "error/fetch_cash_book_record",
}

export type CashBookRecordData = {
  id: number;
  customer_id: number;
  date: Date;
  type: CASH_BOOK_RECORD_TYPES;
  amount: number;
  description: string;
  created_at: Date;
  updated_at: Date;
};
