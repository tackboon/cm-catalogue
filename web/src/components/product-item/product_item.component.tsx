import { FC } from "react";
import { BsArrowsMove } from "react-icons/bs";

import {
  ProductData,
  PRODUCT_STATUS_TYPE,
} from "../../store/product/product.types";
import styles from "./product_item.module.scss";

type ProductItemProps = {
  product: ProductData;
  isDraggable: boolean;
};

const ProductItem: FC<ProductItemProps> = ({
  product,
  isDraggable,
  ...props
}) => {
  const fileID =
    product.preview_id !== ""
      ? product.preview_id
      : product.file_ids && product.file_ids.length > 0
      ? product.file_ids[0]
      : "";
  const imagePath =
    fileID === ""
      ? "/images/no-photo-available.png"
      : process.env.REACT_APP_UPLOADER_ENDPOINT + `/${fileID}`;

  return (
    <div {...props} className={styles["product-item-container"]}>
      <div className={`${styles["move"]} ${isDraggable ? "" : "d-none"}`}>
        <BsArrowsMove />
      </div>
      <img src={imagePath} alt={product.preview_id} draggable={false} />
      <div className={styles["product-item-info"]}>
        <p className={styles["product-item-info__name"]}>{product.name}</p>
        <p className={styles["product-item-info__description"]}>
          {product.description !== "" ? product.description : "\xa0"}
        </p>
        <p>price: RM {product.price.toFixed(2)}</p>
        <p>
          status:{" "}
          <span
            className={
              product.status === PRODUCT_STATUS_TYPE.OUT_OF_STOCK
                ? "text-danger"
                : ""
            }
          >
            {product.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
