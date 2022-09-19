import { all, call, put, takeLatest } from "typed-redux-saga/macro";

import { addToast } from "./toast.action";
import { TOAST_BACKGROUND_TYPE } from "./toast.types";
import { CUSTOMER_ACTION_TYPES } from "../customer/customer.types";
import { CASH_BOOK_ACTION_TYPES } from "../cashbook/cashbook.types";
import { CATEGORY_ACTION_TYPES } from "../category/category.types";
import { PRODUCT_ACTION_TYPES } from "../product/product.types";

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

export function* addCreateNewCategorySuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Add new category success",
    })
  );
}

export function* addUpdateCategorySuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Update category success",
    })
  );
}

export function* addDeleteCategorySuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Delete category success",
    })
  );
}

export function* addDeleteCategoryFailedToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.DANGER,
      title: "Failed",
      message: "Delete category failed",
    })
  );
}

export function* addDeleteProductSuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Delete product success",
    })
  );
}

export function* addDeleteProductFailedToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.DANGER,
      title: "Failed",
      message: "Delete product failed",
    })
  );
}

export function* addUpdateProductSuccessToast() {
  yield* put(
    addToast({
      id: new Date().getTime(),
      type: TOAST_BACKGROUND_TYPE.SUCCESS,
      title: "Success",
      message: "Update product success",
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

export function* onAddNewCategorySuccess() {
  yield* takeLatest(
    CATEGORY_ACTION_TYPES.ADD_CATEGORY_SUCCESS,
    addCreateNewCategorySuccessToast
  );
}

export function* onUpdateCategorySuccess() {
  yield* takeLatest(
    CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_SUCCESS,
    addUpdateCategorySuccessToast
  );
}

export function* onDeleteCategorySuccess() {
  yield* takeLatest(
    CATEGORY_ACTION_TYPES.DELETE_CATEGORY_SUCCESS,
    addDeleteCategorySuccessToast
  );
}

export function* onDeleteCategoryFailed() {
  yield* takeLatest(
    CATEGORY_ACTION_TYPES.DELETE_CATEGORY_FAILED,
    addDeleteCategoryFailedToast
  );
}

export function* onDeleteProductSuccess() {
  yield* takeLatest(
    PRODUCT_ACTION_TYPES.DELETE_PRODUCT_SUCCESS,
    addDeleteProductSuccessToast
  );
}

export function* onDeleteProductFailed() {
  yield* takeLatest(
    PRODUCT_ACTION_TYPES.DELETE_PRODUCT_FAILED,
    addDeleteProductFailedToast
  );
}

export function* onUpdateProductsuccess() {
  yield* takeLatest(
    PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_SUCCESS,
    addUpdateProductSuccessToast
  );
}

export function* toastSagas() {
  yield* all([
    call(onCreateCustomerDataSuccess),
    call(onDeleteCustomerDataSuccess),
    call(onAddCashBookRecordSuccess),
    call(onAddNewCategorySuccess),
    call(onUpdateCategorySuccess),
    call(onDeleteCategorySuccess),
    call(onDeleteCategoryFailed),
    call(onDeleteProductSuccess),
    call(onDeleteProductFailed),
    call(onUpdateProductsuccess),
  ]);
}
