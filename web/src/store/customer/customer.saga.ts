import { all, call, put, select, takeLatest } from "typed-redux-saga/macro";

import {
  CustomerData,
  CUSTOMER_RELATIONSHIP,
  CUSTOMER_ACTION_TYPES,
  CUSTOMER_LOADING_TYPES,
} from "./customer.types";
import {
  createCustomerDataFailed,
  CreateCustomerDataStart,
  createCustomerDataSuccess,
  deleteCustomerDataFailed,
  DeleteCustomerDataStart,
  deleteCustomerDataSuccess,
  fetchAllCustomerDataFailed,
  fetchAllCustomerDataStart,
  fetchAllCustomerDataSuccess,
  setIsCustomerLoading,
  updateCustomerDataFailed,
  UpdateCustomerDataStart,
  updateCustomerDataSuccess,
} from "./customer.action";
import {
  selectCustomerFilter,
  selectCustomerPagination,
  selectCustomerRelationshipFilter,
} from "./customer.selector";
import { api } from "../../service/openapi/openapi.service";

export function* fetchAllCustomer() {
  try {
    const { page, limit } = yield* select(selectCustomerPagination);
    const filter = yield* select(selectCustomerFilter);
    const relationshipFilter = yield* select(selectCustomerRelationshipFilter);

    const res = yield* call(
      [api.CustomerAPI, api.CustomerAPI.getAllCustomersData],
      page,
      limit,
      filter,
      relationshipFilter
    );

    let datas: CustomerData[] = [];
    if (res.data.data) {
      datas = res.data.data.map((c) => {
        return {
          ...c,
          relationship:
            c.relationship === CUSTOMER_RELATIONSHIP.IN_COOPERATION
              ? CUSTOMER_RELATIONSHIP.IN_COOPERATION
              : CUSTOMER_RELATIONSHIP.SUSPENDED,
          created_at: new Date(c.created_at),
          updated_at: new Date(c.updated_at),
        };
      });
    }

    const pagination = {
      limit: limit,
      ...res.data.pagination,
    };

    yield* put(fetchAllCustomerDataSuccess(datas, pagination));
  } catch (err) {
    yield* put(fetchAllCustomerDataFailed(err as string));
  }
}

export function* createCustomerData({
  payload: { data },
}: CreateCustomerDataStart) {
  yield* put(
    setIsCustomerLoading(CUSTOMER_LOADING_TYPES.CREATE_CUSTOMER_DATA, true)
  );

  try {
    yield* call([api.CustomerAPI, api.CustomerAPI.createCustomerData], data);
    yield* put(createCustomerDataSuccess());
    yield* put(fetchAllCustomerDataStart());
  } catch (err) {
    yield* put(createCustomerDataFailed(err as string));
  }
}

export function* updateCustomerData({
  payload: { customerID, data },
}: UpdateCustomerDataStart) {
  yield* put(
    setIsCustomerLoading(CUSTOMER_LOADING_TYPES.UPDATE_CUSTOMER_DATA, true)
  );

  try {
    yield* call(
      [api.CustomerAPI, api.CustomerAPI.updateCustomerData],
      customerID,
      data
    );
    yield* put(updateCustomerDataSuccess());
    yield* put(fetchAllCustomerDataStart());
  } catch (err) {
    yield* put(updateCustomerDataFailed(err as string));
  }
}

export function* deleteCustomerData({ payload }: DeleteCustomerDataStart) {
  try {
    yield* put(
      setIsCustomerLoading(CUSTOMER_LOADING_TYPES.DELETE_CUSTOMER_DATA, true)
    );
    yield* call([api.CustomerAPI, api.CustomerAPI.deleteCutomerData], payload);
    yield* put(deleteCustomerDataSuccess());
    yield* put(fetchAllCustomerDataStart());
  } catch (err) {
    yield* put(deleteCustomerDataFailed(err as string));
  }
}

export function* setRelationshipFilter() {
  yield* put(fetchAllCustomerDataStart());
}

export function* onFetchAllCustomerDataStart() {
  yield* takeLatest(
    CUSTOMER_ACTION_TYPES.FETCH_ALL_CUSTOMER_DATA_START,
    fetchAllCustomer
  );
}

export function* onCreateCustomerDataStart() {
  yield* takeLatest(
    CUSTOMER_ACTION_TYPES.CREATE_CUSTOMER_DATA_START,
    createCustomerData
  );
}

export function* onUpdateCustomerDataStart() {
  yield* takeLatest(
    CUSTOMER_ACTION_TYPES.UPDATE_CUSTOMER_DATA_START,
    updateCustomerData
  );
}

export function* onDeleteCustomerDataStart() {
  yield* takeLatest(
    CUSTOMER_ACTION_TYPES.DELETE_CUSTOMER_DATA_START,
    deleteCustomerData
  );
}

export function* onSetSRelationshipFilter() {
  yield* takeLatest(
    CUSTOMER_ACTION_TYPES.SET_RELATIONSHIP_FILTER,
    setRelationshipFilter
  );
}

export function* customerSagas() {
  yield* all([
    call(onFetchAllCustomerDataStart),
    call(onCreateCustomerDataStart),
    call(onUpdateCustomerDataStart),
    call(onDeleteCustomerDataStart),
    call(onSetSRelationshipFilter),
  ]);
}
