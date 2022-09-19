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
  PRODUCT_ERROR_TYPE,
  PRODUCT_LOADING_TYPE,
} from "../../store/product/product.types";
import { addProductStart } from "../../store/product/product.action";

type AddProductProps = {
  show: boolean;
  onClose: () => void;
  categoryID: number;
};

const AddProduct: FC<AddProductProps> = ({ show, onClose, categoryID }) => {
  const dispatch = useDispatch();
  const { [PRODUCT_LOADING_TYPE.ADD_PRODUCT]: isLoading } = useSelector(
    selectProductIsLoading
  );
  const { [PRODUCT_ERROR_TYPE.ADD_PRODUCT]: submitError } =
    useSelector(selectProductError);

  const onSubmit = (categoryID: number, data: ProductPost) => {
    dispatch(addProductStart(categoryID, data));
  };

  return (
    <Modal backdrop="static" show={show}>
      <Modal.Header className="bg-warning">Add Product - 添加产品</Modal.Header>
      <Modal.Body>
        <ProductForm
          onClose={onClose}
          onSubmit={onSubmit}
          submitError={submitError}
          submitIsLoading={isLoading}
          categoryID={categoryID}
        />
      </Modal.Body>
    </Modal>
  );
};

export default AddProduct;
