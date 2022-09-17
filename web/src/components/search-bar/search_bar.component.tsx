import { ChangeEvent, FC, InputHTMLAttributes, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { BsSearch } from "react-icons/bs";

import styles from "./search_bar.module.scss";

type SearchbarProps = {
  onSearch: (criteria: string) => void;
  placeholder: string;
} & InputHTMLAttributes<HTMLInputElement>;

const SearchBar: FC<SearchbarProps> = ({ placeholder, onSearch, ...props }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debounceSearch(event.target.value);
  };

  const debounceSearch = useRef(
    debounce((criteria: string) => {
      onSearch(criteria);
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  return (
    <div {...props} style={{ width: "100%", position: "relative" }}>
      <input
        className={styles["search-input"]}
        placeholder={placeholder}
        onChange={handleChange}
      />
      <BsSearch className={styles["search-icon"]} />
    </div>
  );
};

export default SearchBar;
