import { FC } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import ProductForm from "../product-form/product_form.component";
import { ProductPost } from "../../openapi/catalogue";
import {
  selectProductError,
  selectProductIsLoading,
} from "../../store/product/product.selector";
import {
  ProductData,
  PRODUCT_ERROR_TYPE,
  PRODUCT_LOADING_TYPE,
} from "../../store/product/product.types";
import { updateProductStart } from "../../store/product/product.action";

type EditProductProps = {
  show: boolean;
  onClose: () => void;
  product: ProductData | undefined;
  categoryID: number;
};

const EditProduct: FC<EditProductProps> = ({
  show,
  onClose,
  product,
  categoryID,
}) => {
  const dispatch = useDispatch();
  const { [PRODUCT_LOADING_TYPE.UPDATE_PRODUCT]: isLoading } = useSelector(
    selectProductIsLoading
  );
  const { [PRODUCT_ERROR_TYPE.UPDATE_PRODUCT]: submitError } =
    useSelector(selectProductError);

  const onSubmit = (categoryID: number, data: ProductPost) => {
    if (product) {
      dispatch(updateProductStart(categoryID, product.id, data));
    }
  };

  return (
    <Modal backdrop="static" show={show}>
      <Modal.Header className="bg-warning">
        Edit Product - 编辑产品
      </Modal.Header>
      <Modal.Body>
        <ProductForm
          onClose={onClose}
          onSubmit={onSubmit}
          submitError={submitError}
          submitIsLoading={isLoading}
          initData={product}
          categoryID={categoryID}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditProduct;
