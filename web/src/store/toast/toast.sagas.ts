import { all, call, put, takeLatest } from "typed-redux-saga/macro";

import { addToast } from "./toast.action";
import { TOAST_BACKGROUND_TYPE } from "./toast.types";
import { CUSTOMER_ACTION_TYPES } from "../customer/customer.types";
import { CASH_BOOK_ACTION_TYPES } from "../cashbook/cashbook.types";

export function* addCreateCustomerSuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Create customer data success.",
    })
  );
}

export function* addDeleteCustomerSuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Delete customer data success",
    })
  );
}

export function* addCreateCashBookRecordSuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Add cash book record success",
    })
  );
}

export function* onCreateCustomerDataSuccess() {
  yield* takeLatest(
    CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_SUCCESS,
    addCreateCustomerSuccessToast
  );
}

export function* onDeleteCustomerDataSuccess() {
  yield* takeLatest(
    CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_SUCCESS,
    addDeleteCustomerSuccessToast
  );
}

export function* onAddCashBookRecordSuccess() {
  yield* takeLatest(
    CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_SUCCESS,
    addCreateCashBookRecordSuccessToast
  );
}

export function* toastSagas() {
  yield* all([
    call(onCreateCustomerDataSuccess),
    call(onDeleteCustomerDataSuccess),
    call(onAddCashBookRecordSuccess),
  ]);
}
