import { all, call } from "typed-redux-saga/macro";

import { customerSagas } from "./customer/customer.saga";
import { toastSagas } from "./toast/toast.sagas";
import { userSagas } from "./user/user.saga";
import { cashBookSagas } from "./cashbook/cashbook.saga";

export function* rootSaga() {
  yield* all([
    call(customerSagas),
    call(userSagas),
    call(toastSagas),
    call(cashBookSagas),
  ]);
}
