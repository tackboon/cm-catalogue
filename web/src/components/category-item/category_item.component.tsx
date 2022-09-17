import { FC, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryData } from "../../store/category/category.types";
import { BsFillPencilFill } from "react-icons/bs";

import styles from "./category_item.module.scss";

type CategoryItemProps = {
  category: CategoryData;
};

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
  const navigate = useNavigate();
  const imagePath =
    category.file_id === ""
      ? "/images/no-photo-available.png"
      : process.env.REACT_APP_UPLOADER_ENDPOINT + `/${category.file_id}`;

  const handleNavigate = (
    event: MouseEvent<HTMLElement>,
    categoryID: number
  ) => {
    if (event.target) {
      const el = event.target as HTMLElement | SVGElement;
      if (el.nodeName !== "svg" && el.nodeName !== "path") {
        navigate(`/categories/${categoryID}/products`);
      } else {
        navigate(`/categories/${categoryID}`);
      }
    }
  };

  return (
    <div
      className={styles["category-item-container"]}
      onClick={(event) => handleNavigate(event, category.id)}
    >
      <img src={imagePath} alt={category.file_id} />
      <div className={styles["category-item-description"]}>
        <p>{category.name}</p>
        <BsFillPencilFill className={styles["category-item-edit"]} />
      </div>
    </div>
  );
};

export default CategoryItem;
