import { FC, ButtonHTMLAttributes } from "react";
import { Button, Spinner, ButtonProps } from "react-bootstrap";

type LoadingButtonProps = {
  title: string;
  loadingTitle: string;
  isLoading: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonProps;

const LoadingButton: FC<LoadingButtonProps> = ({
  title,
  loadingTitle,
  isLoading,
  ...props
}) => (
  <Button disabled={isLoading ? true : false} {...props}>
    {isLoading ? (
      <>
        {loadingTitle}
        <Spinner animation="border" size="sm" className="ms-3" />
      </>
    ) : (
      title
    )}
  </Button>
);

export default LoadingButton;
