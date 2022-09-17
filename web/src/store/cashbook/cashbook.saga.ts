import { all, call, put, takeLatest } from "typed-redux-saga/macro";
import { CashBookRecordPost } from "../../openapi/customer";
import { api } from "../../service/openapi/openapi.service";
import { withEnumGuard } from "../../utils/enum/enum_guard";
import { setCustomerTotalUnbilledAmount } from "../customer/customer.action";
import {
  addCashBookRecordFailed,
  AddCashBookRecordStart,
  addCashBookRecordSuccess,
  deleteCashBookRecordFailed,
  DeleteCashBookRecordStart,
  deleteCashBookRecordSuccess,
  fetchCashBookRecordFailed,
  FetchCashBookRecordStart,
  fetchCashBookRecordSuccess,
  setIsCashBookLoading,
} from "./cashbook.action";
import {
  CashBookRecordData,
  CASH_BOOK_ACTION_TYPES,
  CASH_BOOK_LOADING_TYPES,
  CASH_BOOK_RECORD_TYPES,
} from "./cashbook.types";

export function* addCashBookRecord({
  payload: { customerID, date, type, amount, description },
}: AddCashBookRecordStart) {
  yield* put(
    setIsCashBookLoading(CASH_BOOK_LOADING_TYPES.ADD_CASH_BOOK_RECORD, true)
  );

  try {
    const cashBookRecordPost: CashBookRecordPost = {
      date: date.toISOString(),
      type,
      amount: amount * 1,
      description,
    };

    yield* call(
      [api.CashBookAPI, api.CashBookAPI.createCashBookRecord],
      customerID,
      cashBookRecordPost
    );

    let unbilledAmount = 1 * amount;
    if (type === CASH_BOOK_RECORD_TYPES.DEBIT) {
      unbilledAmount = -1 * amount;
    }

    yield* put(addCashBookRecordSuccess());
    yield* put(setCustomerTotalUnbilledAmount(customerID, unbilledAmount));
  } catch (error) {
    yield* put(addCashBookRecordFailed(error as string));
  }
}

export function* fetchCashBookRecords({
  payload: { customerID, start, end },
}: FetchCashBookRecordStart) {
  try {
    const res = yield* call(
      [api.CashBookAPI, api.CashBookAPI.getCashBookRecords],
      customerID,
      start.toISOString(),
      end.toISOString()
    );

    let records: CashBookRecordData[] = [];
    if (res.data.data) {
      records = res.data.data.map((r) => {
        let type: CASH_BOOK_RECORD_TYPES;
        if (withEnumGuard(CASH_BOOK_RECORD_TYPES).check(r.type)) {
          type = r.type;
        } else {
          throw new Error("Invalid record type!");
        }

        return {
          ...r,
          date: new Date(r.date),
          type,
          created_at: new Date(r.created_at),
          updated_at: new Date(r.updated_at),
        };
      });
    }

    yield* put(fetchCashBookRecordSuccess(records));
  } catch (error) {
    yield* put(fetchCashBookRecordFailed(error as string));
  }
}

export function* deleteCashBookRecord({
  payload: { customerID, recordID, type, amount },
}: DeleteCashBookRecordStart) {
  try {
    yield* call(
      [api.CashBookAPI, api.CashBookAPI.deleteCashBookRecord],
      customerID,
      recordID
    );
    yield* put(deleteCashBookRecordSuccess(recordID));

    let unbilledAmount = 1 * amount;
    if (type === CASH_BOOK_RECORD_TYPES.CREDIT) {
      unbilledAmount = -1 * amount;
    }
    yield* put(setCustomerTotalUnbilledAmount(customerID, unbilledAmount));
  } catch (error) {
    yield* put(deleteCashBookRecordFailed(error as string));
  }
}

export function* onAddCashBookRecordStart() {
  yield* takeLatest(
    CASH_BOOK_ACTION_TYPES.ADD_CASH_BOOK_RECORD_START,
    addCashBookRecord
  );
}

export function* onFetchCashBookRecordStart() {
  yield* takeLatest(
    CASH_BOOK_ACTION_TYPES.FETCH_CASH_BOOK_RECORD_START,
    fetchCashBookRecords
  );
}

export function* onDeleteCashbookRecordStart() {
  yield* takeLatest(
    CASH_BOOK_ACTION_TYPES.DELETE_CASH_BOOK_RECORD_START,
    deleteCashBookRecord
  );
}

export function* cashBookSagas() {
  yield* all([
    call(onAddCashBookRecordStart),
    call(onFetchCashBookRecordStart),
    call(onDeleteCashbookRecordStart),
  ]);
}
