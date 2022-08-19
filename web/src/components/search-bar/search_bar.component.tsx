import { ChangeEvent, FC, InputHTMLAttributes, useEffect, useRef } from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { debounce } from "lodash";

type SearchbarProps = {
  onSearch: (criteria: string) => void;
  placeholder: string;
} & InputHTMLAttributes<HTMLInputElement> &
  FormControlProps;

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

  return <input {...props} placeholder={placeholder} onChange={handleChange} />;
};

export default SearchBar;
