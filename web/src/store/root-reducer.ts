import { combineReducers } from "@reduxjs/toolkit";

import { customerReducer } from "./customer/customer.reducer";
import { toastReducer } from "./toast/toast.reducer";
import { userReducer } from "./user/user.reducer";
import { cashBookReducer } from "./cashbook/cashbook.reducer";
import { categoryReducer } from "./category/category.reducer";
import { tusUploadReducer } from "./tus-upload/tus_upload.reducer";
import { productReducer } from "./product/product.reducer";

export const rootReducer = combineReducers({
  customer: customerReducer,
  user: userReducer,
  toast: toastReducer,
  cashbook: cashBookReducer,
  category: categoryReducer,
  tusUpload: tusUploadReducer,
  product: productReducer,
});
