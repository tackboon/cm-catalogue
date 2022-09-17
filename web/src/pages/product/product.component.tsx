import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import AddProduct from "../../components/add-product/add_product.component";
import EditProduct from "../../components/edit-product/edit_product.component";
import ProductItem from "../../components/product-item/product_item.component";
import SearchBar from "../../components/search-bar/search_bar.component";
import { selectCategories } from "../../store/category/category.selector";
import {
  fetchAllProductStart,
  searchProductStart,
  setCategoryID,
  setStatusFilter,
} from "../../store/product/product.action";
import {
  selectProductIsLoading,
  selectProductPagination,
  selectProducts,
  selectProductStatusFilter,
} from "../../store/product/product.selector";
import {
  ProductData,
  PRODUCT_LOADING_TYPE,
  SELECT_PRODUCT_STATUS,
} from "../../store/product/product.types";
import { withEnumGuard } from "../../utils/enum/enum_guard";
import {
  GridContainer,
  BlockWrapper,
  GridCallbackProps,
} from "@tackboon/react-grid-rearrange";
import styles from "./product.module.scss";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductData>();
  const products = useSelector(selectProducts);

  const params = useParams();
  let categoryID = 0;
  if (params.id) {
    categoryID = parseInt(params.id);
  }

  const categories = useSelector(selectCategories);
  const currentCategory = categories.filter((c) => c.id === categoryID)[0];

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      navigate(`/categories/${event.target.value}/products`);
    }
  };

  const statusFilter = useSelector(selectProductStatusFilter);
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = withEnumGuard(SELECT_PRODUCT_STATUS).check(e.target.value)
      ? e.target.value
      : SELECT_PRODUCT_STATUS.ALL;
    dispatch(setStatusFilter(value));
  };

  useEffect(() => {
    dispatch(setCategoryID(currentCategory.id));
  }, [currentCategory]);

  const { [PRODUCT_LOADING_TYPE.FETCH_ALL_PRODUCT]: isFetching } = useSelector(
    selectProductIsLoading
  );
  const pagination = useSelector(selectProductPagination);
  useEffect(() => {
    const wrapper = document.getElementById(
      "content-wrapper"
    ) as HTMLDivElement;
    if (wrapper) {
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
  }, [isFetching]);

  const handleProductClick = useCallback((product: ProductData) => {
    setCurrentProduct(product);
    setShowEditProduct(true);
  }, []);

  const gridCallback = useCallback(({
    isClick,
    order,
    isDragging,
    lastMovingIndex,
  }: GridCallbackProps) => {
    if (isClick && !isDragging) {
      handleProductClick(products[lastMovingIndex]);
    }

    if (lastMovingIndex !== -1 && !isDragging) {
      const newOrder = order.map((o) => products[o]);
      // console.log(newOrder);
    }
  }, [handleProductClick, products]);

  return (
    <>
      <Container>
        <div className={styles["product-header"]}>
          <h1>{currentCategory.name}</h1>
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
              defaultValue={currentCategory.id}
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
              defaultValue={statusFilter}
              onChange={handleStatusChange}
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
                cb={gridCallback}
              >
                {(styles) =>
                  styles.map((style, i) => (
                    <BlockWrapper animationStyle={style} key={i} index={i}>
                      <ProductItem product={products[i]} />
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
        categoryID={currentCategory.id}
      />
      <EditProduct
        show={showEditProduct}
        onClose={() => setShowEditProduct(false)}
        product={currentProduct}
        categoryID={currentCategory.id}
      />
    </>
  );
};

export default Product;
