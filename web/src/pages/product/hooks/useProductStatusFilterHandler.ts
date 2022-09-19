import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setStatusFilter } from "../../../store/product/product.action";
import { selectProductStatusFilter } from "../../../store/product/product.selector";
import { SELECT_PRODUCT_STATUS } from "../../../store/product/product.types";
import { withEnumGuard } from "../../../utils/enum/enum_guard";

const useProductStatusFilterHandler = () => {
  const dispatch = useDispatch();
  const selectedProductStatus = useSelector(selectProductStatusFilter);

  const handleProductStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = withEnumGuard(SELECT_PRODUCT_STATUS).check(e.target.value)
      ? e.target.value
      : SELECT_PRODUCT_STATUS.ALL;
    dispatch(setStatusFilter(value));
  };

  return {
    selectedProductStatus,
    handleProductStatusChange,
  };
};

export default useProductStatusFilterHandler;
