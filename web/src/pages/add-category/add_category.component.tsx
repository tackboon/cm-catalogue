import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import CategoryForm from "../../components/category-form/category_form.component";
import { addCategoryStart } from "../../store/category/category.action";
import {
  selectCategoryError,
  selectCategorysLoading,
} from "../../store/category/category.selector";
import {
  CATEGORY_ERROR_TYPES,
  CATEGORY_LOADING_TYPES,
} from "../../store/category/category.types";
import styles from "./add_category.module.scss";

const AddCategory = () => {
  const dispatch = useDispatch();
  const { [CATEGORY_LOADING_TYPES.ADD_CATEGORY]: isLoading } = useSelector(
    selectCategorysLoading
  );
  const { [CATEGORY_ERROR_TYPES.ADD_CATEGORY]: submitError } =
    useSelector(selectCategoryError);

  const handleSubmit = (name: string, fileID: string) => {
    dispatch(addCategoryStart({ name, file_id: fileID }));
  };

  return (
    <Container>
      <div className={styles["add-category-header"]}>
        <h1>Add New Category - 添加分类</h1>
      </div>

      <CategoryForm
        onSubmit={handleSubmit}
        error={submitError}
        isSubmitLoading={isLoading}
      />
    </Container>
  );
};

export default AddCategory;
