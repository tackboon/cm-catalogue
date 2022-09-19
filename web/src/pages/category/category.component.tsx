import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CategoryItem from "../../components/category-item/category_item.component";
import { fetchAllCategoriesStart } from "../../store/category/category.action";
import { selectCategories } from "../../store/category/category.selector";

import styles from "./category.module.scss";

const Category = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchAllCategoriesStart());
  }, [dispatch]);

  return (
    <Container>
      <div className={styles["category-header"]}>
        <h1>Categories - 产品分类</h1>
      </div>

      <div className={styles["category-body"]}>
        {categories.map((c) => (
          <CategoryItem category={c} key={c.id} />
        ))}

        <div
          className={styles["add-category-container"]}
          onClick={() => navigate("/categories/add-category")}
        >
          <div className={styles["add-category-wrapper"]}>
            <div className={styles["plus-sign-wrapper"]}>
              <BsPlusLg className={styles["plus-sign"]} />
            </div>
            <p>New Category</p>
          </div>

          <div className={styles["add-category-backdrop"]} />
        </div>
      </div>
    </Container>
  );
};

export default Category;
