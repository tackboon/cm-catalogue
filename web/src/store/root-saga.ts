import { all, call } from "typed-redux-saga/macro";

import { customerSagas } from "./customer/customer.saga";
import { toastSagas } from "./toast/toast.sagas";
import { userSagas } from "./user/user.saga";
import { cashBookSagas } from "./cashbook/cashbook.saga";
import { categorySagas } from "./category/category.saga";
import { tusUploadSagas } from "./tus-upload/tus_upload.saga";
import { productSagas } from "./product/product.saga";

export function* rootSaga() {
  yield* all([
    call(customerSagas),
    call(userSagas),
    call(toastSagas),
    call(cashBookSagas),
    call(categorySagas),
    call(tusUploadSagas),
    call(productSagas),
  ]);
}
