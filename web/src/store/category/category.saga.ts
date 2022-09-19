import { all, call, put, takeLatest } from "typed-redux-saga/macro";
import { api } from "../../service/openapi/openapi.service";
import {
  addCategoryFailed,
  AddCategoryStart,
  addCategorySuccess,
  deleteCategoryFailed,
  DeleteCategoryStart,
  deleteCategorySuccess,
  fetchAllCategoriesFailed,
  fetchAllCategoriesSuccess,
  setIsCategoryLoading,
  updateCategoryFailed,
  UpdateCategoryStart,
  updateCategorySuccess,
} from "./category.action";
import {
  CategoryData,
  CATEGORY_ACTION_TYPES,
  CATEGORY_LOADING_TYPES,
} from "./category.types";

export function* fetchAllCategory() {
  try {
    const res = yield* call([
      api.CategoryAPI,
      api.CategoryAPI.getAllCategories,
    ]);

    let datas: CategoryData[] = [];
    if (res.data.categories) {
      datas = res.data.categories;
    }
    yield* put(fetchAllCategoriesSuccess(datas));
  } catch (error) {
    yield* put(fetchAllCategoriesFailed(error as string));
  }
}

export function* addNewCategory({ payload }: AddCategoryStart) {
  try {
    yield* put(setIsCategoryLoading(CATEGORY_LOADING_TYPES.ADD_CATEGORY, true));
    const res = yield* call(
      [api.CategoryAPI, api.CategoryAPI.createCategory],
      payload
    );
    yield* put(addCategorySuccess(res.data));
  } catch (error) {
    yield* put(addCategoryFailed(error as string));
  }
}

export function* updateCategory({ payload }: UpdateCategoryStart) {
  try {
    yield* put(
      setIsCategoryLoading(CATEGORY_LOADING_TYPES.UPDATE_CATEGORY, true)
    );

    const res = yield* call(
      [api.CategoryAPI, api.CategoryAPI.updateCategory],
      payload.id,
      { name: payload.name, file_id: payload.file_id }
    );
    yield* put(updateCategorySuccess(res.data));
  } catch (error) {
    yield* put(updateCategoryFailed(error as string));
  }
}

export function* deleteCategory({ payload }: DeleteCategoryStart) {
  try {
    yield* put(
      setIsCategoryLoading(CATEGORY_LOADING_TYPES.DELETE_CATEGORY, true)
    );
    yield* call([api.CategoryAPI, api.CategoryAPI.deleteCategory], payload);
    yield* put(deleteCategorySuccess(payload));
  } catch (error) {
    yield* put(deleteCategoryFailed(error as string));
  }
}

export function* onFetchAllCategoryStart() {
  yield* takeLatest(
    CATEGORY_ACTION_TYPES.FETCH_ALL_CATEGORIES_START,
    fetchAllCategory
  );
}

export function* onAddNewCategoryStart() {
  yield* takeLatest(CATEGORY_ACTION_TYPES.ADD_CATEGORY_START, addNewCategory);
}

export function* onUpdateCategoryStart() {
  yield* takeLatest(
    CATEGORY_ACTION_TYPES.UPDATE_CATEGORY_START,
    updateCategory
  );
}

export function* onDeleteCategoryDataStart() {
  yield* takeLatest(
    CATEGORY_ACTION_TYPES.DELETE_CATEGORY_START,
    deleteCategory
  );
}

export function* categorySagas() {
  yield* all([
    call(onFetchAllCategoryStart),
    call(onAddNewCategoryStart),
    call(onUpdateCategoryStart),
    call(onDeleteCategoryDataStart),
  ]);
}
