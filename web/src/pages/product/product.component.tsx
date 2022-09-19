import { useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GridContainer, BlockWrapper } from "@tackboon/react-grid-rearrange";

import {
  resetProductFilter,
  searchProductStart,
} from "../../store/product/product.action";
import { selectProducts } from "../../store/product/product.selector";
import {
  ProductData,
  SELECT_PRODUCT_STATUS,
} from "../../store/product/product.types";

import AddProduct from "../../components/add-product/add_product.component";
import EditProduct from "../../components/edit-product/edit_product.component";
import ProductItem from "../../components/product-item/product_item.component";
import SearchBar from "../../components/search-bar/search_bar.component";

import useCategoryFilterHandler from "./hooks/useCategoryFilterHandler";
import useProductStatusFilterHandler from "./hooks/useProductStatusFilterHandler";
import useProductPagination from "./hooks/useProductPagination";
import useProductDragHandler from "./hooks/useProductDragHandler";
import styles from "./product.module.scss";

const Product = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductData>();
  const products = useSelector(selectProducts);

  // handle pagination on scroll
  useProductPagination();

  // handle category filter
  const { selectedCategory, categories, handleCategoryChange } =
    useCategoryFilterHandler(params.id ? +params.id : 0);

  // handle product status filter
  const { selectedProductStatus, handleProductStatusChange } =
    useProductStatusFilterHandler();

  // handle product click
  const handleProductClick = useCallback((product: ProductData) => {
    setCurrentProduct(product);
    setShowEditProduct(true);
  }, []);

  // handle drag and reorder product
  const { disableDrag, gridCallback } =
    useProductDragHandler(handleProductClick);

  // clean up search bar on exit
  useEffect(() => {
    return () => {
      dispatch(resetProductFilter());
    };
  }, [dispatch]);

  return (
    <>
      <Container>
        <div className={styles["product-header"]}>
          <h1>{selectedCategory.name}</h1>
        </div>

        <div className={styles["product-body"]}>
          <div className={styles["bar"]}>
            <SearchBar
              className={styles["search-bar"]}
              placeholder="Search product here..."
              onSearch={(criteria) => {
                dispatch(searchProductStart(criteria));
              }}
            />

            <Form.Select
              className={styles["select-category"]}
              defaultValue={selectedCategory.id}
              onChange={handleCategoryChange}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              className={styles["select-status"]}
              defaultValue={selectedProductStatus}
              onChange={handleProductStatusChange}
            >
              <option value={SELECT_PRODUCT_STATUS.ALL}>All</option>
              <option value={SELECT_PRODUCT_STATUS.IN_STOCK}>In Stock</option>
              <option value={SELECT_PRODUCT_STATUS.OUT_OF_STOCK}>
                Out of Stock
              </option>
            </Form.Select>

            <Button
              variant="danger"
              onClick={() => {
                setShowAddProduct(true);
              }}
            >
              Add Product
            </Button>
          </div>

          {products.length === 0 ? (
            <Card className="mb-3">
              <h1 className={styles["no-found"]}>
                &#8212; No Product Found &#8212;
              </h1>
            </Card>
          ) : (
            <div className={styles["product-wrapper"]}>
              <GridContainer
                itemWidth={320}
                itemHeight={400}
                rowGap={50}
                colGap={50}
                totalItem={products.length}
                disableDrag={disableDrag}
                cb={gridCallback}
                scrollElementID="content-wrapper"
              >
                {(styles) =>
                  styles.map((style, i) => (
                    <BlockWrapper animationStyle={style} key={i} index={i}>
                      <ProductItem
                        product={products[i]}
                        isDraggable={!disableDrag}
                      />
                    </BlockWrapper>
                  ))
                }
              </GridContainer>
            </div>
          )}
        </div>
      </Container>

      <AddProduct
        show={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        categoryID={selectedCategory.id}
      />
      <EditProduct
        show={showEditProduct}
        onClose={() => setShowEditProduct(false)}
        product={currentProduct}
        categoryID={selectedCategory.id}
      />
    </>
  );
};

export default Product;
