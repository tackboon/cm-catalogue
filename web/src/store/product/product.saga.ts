import { all, call, put, select, takeLatest } from "typed-redux-saga/macro";
import { api } from "../../service/openapi/openapi.service";

import {
  addProductFailed,
  AddProductStart,
  addProductSuccess,
  deleteProductFailed,
  DeleteProductStart,
  deleteProductSuccess,
  fetchAllProductFailed,
  fetchAllProductStart,
  fetchAllProductSuccess,
  resetProductList,
  setIsProductLoading,
  SetProductPosition,
  updateProductFailed,
  UpdateProductStart,
  updateProductSuccess,
} from "./product.action";
import {
  selectCategoryID,
  selectProductFilter,
  selectProductPagination,
  selectProductStatusFilter,
} from "./product.selector";
import {
  PRODUCT_ACTION_TYPES,
  PRODUCT_LOADING_TYPE,
  PRODUCT_STATUS_TYPE,
} from "./product.types";

export function* searchProduct() {
  yield* put(fetchAllProductStart());
}

export function* fetchAllProducts() {
  try {
    yield* put(
      setIsProductLoading(PRODUCT_LOADING_TYPE.FETCH_ALL_PRODUCT, true)
    );

    const categoryID = yield* select(selectCategoryID);
    const pagination = yield* select(selectProductPagination);
    const filter = yield* select(selectProductFilter);
    const statusFilter = yield* select(selectProductStatusFilter);

    if (!pagination.isLastPage) {
      const res = yield* call(
        [api.ProductAPI, api.ProductAPI.getAllCategoryProducts],
        categoryID,
        pagination.startPosition,
        pagination.limit,
        filter,
        statusFilter
      );

      if (res.data.data && res.data.data.length > 0) {
        let newStartPosition = NaN;
        const products = res.data.data.map((product) => {
          if (isNaN(newStartPosition)) {
            newStartPosition = product.position;
          } else if (product.position < newStartPosition) {
            newStartPosition = product.position;
          }

          return {
            ...product,
            status:
              product.status === PRODUCT_STATUS_TYPE.IN_STOCK
                ? PRODUCT_STATUS_TYPE.IN_STOCK
                : PRODUCT_STATUS_TYPE.OUT_OF_STOCK,
          };
        });

        yield* put(fetchAllProductSuccess(products, newStartPosition, false));
      } else {
        yield* put(fetchAllProductSuccess([], pagination.startPosition, true));
      }
    } else {
      yield* put(
        fetchAllProductSuccess(
          [],
          pagination.startPosition,
          pagination.isLastPage
        )
      );
    }
  } catch (err) {
    yield* put(fetchAllProductFailed(err as string));
  }
}

export function* addProduct({ payload }: AddProductStart) {
  try {
    const currentPageCategoryID = yield* select(selectCategoryID);

    yield* put(setIsProductLoading(PRODUCT_LOADING_TYPE.ADD_PRODUCT, true));
    yield* call(
      [api.ProductAPI, api.ProductAPI.createProduct],
      payload.categoryID,
      payload.product
    );

    yield* put(addProductSuccess(payload.categoryID));

    if (currentPageCategoryID === +payload.categoryID) {
      yield* put(resetProductList());
      yield* put(fetchAllProductStart());
    }
  } catch (err) {
    yield* put(addProductFailed(err as string));
  }
}

export function* deleteProduct({ payload }: DeleteProductStart) {
  try {
    yield* call(
      [api.ProductAPI, api.ProductAPI.deleteProduct],
      payload.categoryID,
      payload.productID
    );
    yield* put(deleteProductSuccess(payload.productID));
  } catch (error) {
    yield* put(deleteProductFailed(error as string));
  }
}

export function* updateProduct({ payload }: UpdateProductStart) {
  try {
    const currentPageCategoryID = yield* select(selectCategoryID);
    yield* put(setIsProductLoading(PRODUCT_LOADING_TYPE.UPDATE_PRODUCT, true));
    const res = yield* call(
      [api.ProductAPI, api.ProductAPI.updateProduct],
      currentPageCategoryID,
      payload.productID,
      payload.product
    );

    const product = {
      ...res.data,
      status:
        res.data.status === PRODUCT_STATUS_TYPE.IN_STOCK
          ? PRODUCT_STATUS_TYPE.IN_STOCK
          : PRODUCT_STATUS_TYPE.OUT_OF_STOCK,
    };
    yield* put(updateProductSuccess(product));
  } catch (err) {
    yield* put(updateProductFailed(err as string));
  }
}

export function* updateProductPosition({ payload }: SetProductPosition) {
  try {
    const categoryID = yield* select(selectCategoryID);
    yield* call(
      [api.ProductAPI, api.ProductAPI.setProductPosition],
      categoryID,
      payload.id,
      {
        position: payload.position,
      }
    );
  } catch (error) {
    console.error("failed to set product position");
  }
}

export function* onSearchProductStart() {
  yield* takeLatest(PRODUCT_ACTION_TYPES.SEARCH_PRODUCT_START, searchProduct);
}

export function* onFetchAllProductStart() {
  yield* takeLatest(
    PRODUCT_ACTION_TYPES.FETCH_ALL_PRODUCT_START,
    fetchAllProducts
  );
}

export function* onSetCategoryID() {
  yield* takeLatest(PRODUCT_ACTION_TYPES.SET_CATEGORY_ID, fetchAllProducts);
}

export function* onSetStatusFilter() {
  yield* takeLatest(PRODUCT_ACTION_TYPES.SET_STATUS_FILTER, fetchAllProducts);
}

export function* onAddProductStart() {
  yield* takeLatest(PRODUCT_ACTION_TYPES.ADD_PRODUCT_START, addProduct);
}

export function* onDeleteProductStart() {
  yield* takeLatest(PRODUCT_ACTION_TYPES.DELETE_PRODUCT_START, deleteProduct);
}

export function* onUpdateProductStart() {
  yield* takeLatest(PRODUCT_ACTION_TYPES.UPDATE_PRODUCT_START, updateProduct);
}

export function* onSetProductPosition() {
  yield* takeLatest(
    PRODUCT_ACTION_TYPES.SET_PRODUCT_POSITION,
    updateProductPosition
  );
}

export function* productSagas() {
  yield* all([
    call(onSearchProductStart),
    call(onFetchAllProductStart),
    call(onSetStatusFilter),
    call(onSetCategoryID),
    call(onAddProductStart),
    call(onDeleteProductStart),
    call(onUpdateProductStart),
    call(onSetProductPosition),
  ]);
}
