import { GridCallbackProps } from "@tackboon/react-grid-rearrange";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProductPosition } from "../../../store/product/product.action";

import {
  selectProductFilter,
  selectProducts,
  selectProductStatusFilter,
} from "../../../store/product/product.selector";
import {
  ProductData,
  SELECT_PRODUCT_STATUS,
} from "../../../store/product/product.types";
import { checkIsTouchScreendevice } from "../../../utils/device/checkIsTouchScreenDevice";

const useProductDragHandler = (
  handleProductClick: (product: ProductData) => void
) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productFilter = useSelector(selectProductFilter);
  const productStatusFilter = useSelector(selectProductStatusFilter);
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false);

  // check is touch screen device
  useEffect(() => {
    if (checkIsTouchScreendevice()) {
      setIsTouchScreenDevice(true);
    }
  }, []);

  // Set disable drag condition
  const [disableDrag, setDisableDrag] = useState(false);
  useEffect(() => {
    if (
      isTouchScreenDevice ||
      productFilter !== "" ||
      productStatusFilter !== SELECT_PRODUCT_STATUS.ALL
    ) {
      setDisableDrag(true);
    } else {
      setDisableDrag(false);
    }
  }, [productFilter, productStatusFilter, isTouchScreenDevice]);

  // We are setting products state inside a useCallback,
  // it will cause infinite loop, therefore we will need
  // extra condition isReady to fix that
  const isReady = useRef(false);
  const gridCallback = useCallback(
    ({ isClick, order, isDragging, lastMovingIndex }: GridCallbackProps) => {
      // handle drag start
      if (isDragging && !isClick) {
        isReady.current = true;
      }

      // handle click event
      if (isClick && !isDragging) {
        handleProductClick(products[lastMovingIndex]);
      }

      // handle drag end event
      if (isReady.current && lastMovingIndex !== -1 && !isDragging) {
        isReady.current = false;
        const movingProduct = products[lastMovingIndex];
        const movingProductOrderIndex = order.indexOf(lastMovingIndex);
        const prevProduct = products[order[movingProductOrderIndex - 1]];
        const prev2Product = products[order[movingProductOrderIndex - 2]];
        const nextProduct = products[order[movingProductOrderIndex + 1]];
        const next2Product = products[order[movingProductOrderIndex + 2]];

        let newPosition = 0;
        if (prevProduct && nextProduct) {
          // if product moved to middle
          newPosition = (prevProduct.position + nextProduct.position) / 2;
        } else if (!prevProduct) {
          // if product moved to first place
          newPosition = nextProduct.position;
          const nextProductNewPosition =
            (next2Product.position + newPosition) / 2;
          // update previous product new position
          dispatch(setProductPosition(nextProduct.id, nextProductNewPosition));
        } else if (!nextProduct) {
          // if product moved to last place
          newPosition = prevProduct.position;
          const prevProductNewPosition =
            (prev2Product.position + newPosition) / 2;
          // update next product new position
          dispatch(setProductPosition(prevProduct.id, prevProductNewPosition));
        }
        // update moved product new position
        dispatch(setProductPosition(movingProduct.id, newPosition));
      }
    },
    [handleProductClick, dispatch, products]
  );

  return {
    gridCallback,
    disableDrag,
  };
};

export default useProductDragHandler;
