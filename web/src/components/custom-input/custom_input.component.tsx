import { FC, forwardRef, InputHTMLAttributes } from "react";
import { Form, FormControlProps } from "react-bootstrap";

export const enum CustomInputType {
  ALPHA = "alpha",
  NUMERIC = "digit",
  ALPHA_NUMERIC = "alpha_numeric",
}

type CustomInputProps = {
  customInputType: CustomInputType;
} & InputHTMLAttributes<HTMLInputElement> &
  FormControlProps;

// Using forward ref for react hook form ref
const CustomInput: FC<CustomInputProps> = forwardRef(
  ({ customInputType, ...props }, ref) => {
    const replaceHandler = (value: string, type: CustomInputType): string => {
      let v = "";

      switch (type) {
        case CustomInputType.ALPHA:
          // Only allow alpha input
          v = value.replace(/[^A-Za-z ]/g, "");
          break;
        case CustomInputType.ALPHA_NUMERIC:
          // Only allow alpha numeric input
          v = value.replace(/\W/g, "");
          break;
        case CustomInputType.NUMERIC:
          // Only allow numeric input
          v = value.replace(/\D/g, "");
          break;
      }

      return v;
    };

    return (
      <Form.Control
        {...props}
        ref={ref}
        onChange={(e) => {
          e.preventDefault();
          e.target.value = replaceHandler(e.target.value, customInputType);
        }}
      />
    );
  }
);

export default CustomInput;
