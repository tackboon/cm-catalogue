import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllProductStart } from "../../../store/product/product.action";
import {
  selectProductIsLoading,
  selectProductPagination,
} from "../../../store/product/product.selector";
import { PRODUCT_LOADING_TYPE } from "../../../store/product/product.types";

const useProductPagination = () => {
  const dispatch = useDispatch();

  const pagination = useSelector(selectProductPagination);
  const { [PRODUCT_LOADING_TYPE.FETCH_ALL_PRODUCT]: isFetching } = useSelector(
    selectProductIsLoading
  );

  useEffect(() => {
    const wrapper = document.getElementById(
      "content-wrapper"
    ) as HTMLDivElement;
    
    if (wrapper) {
      // trigger fetch data if scroll is more than 80%
      const handlePagination = () => {
        const contentHeight = wrapper.scrollHeight - wrapper.offsetHeight;
        if (
          !pagination.isLastPage &&
          !isFetching &&
          (contentHeight - wrapper.scrollTop) / contentHeight < 0.2
        ) {
          dispatch(fetchAllProductStart());
        }
      };

      wrapper.addEventListener("scroll", handlePagination);
      return () => {
        wrapper.removeEventListener("scroll", handlePagination);
      };
    }
  }, [isFetching, dispatch, pagination.isLastPage]);
};

export default useProductPagination;
