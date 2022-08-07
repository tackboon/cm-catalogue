import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

import { emailSignInStart } from "../../store/user/user.action";
import {
  selectCurrentUser,
  selectUserError,
  selectUserIsLoading,
} from "../../store/user/user.selector";
import {
  USER_ACTION_TYPES,
  USER_LOADING_TYPES,
} from "../../store/user/user.types";
import LoadingButton from "../../components/loading-button/loading_button.component";
import styles from "./sign_in.module.scss";

type SignInFormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) navigate("/", { replace: true });
  }, [currentUser]);

  const dispatch = useDispatch();
  const { [USER_ACTION_TYPES.SIGN_IN_FAILED]: signInError } =
    useSelector(selectUserError);
  const { [USER_LOADING_TYPES.SIGN_IN]: signInIsLoading } =
    useSelector(selectUserIsLoading);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInFormValues>();

  const onSubmit = ({ email, password }: SignInFormValues) => {
    dispatch(emailSignInStart(email, password));
  };

  return (
    <div className={styles["sign-in-container"]}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card className={styles["sign-in-card"]}>
          <Card.Header>Sign In</Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                {...register("email", {
                  required: "Email field is required.",
                  pattern: {
                    value:
                      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                    message: "Please enter a valid email.",
                  },
                })}
                type="email"
                placeholder="Enter your email"
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              className={`${styles["password-input-group"]} position-relative mb-3`}
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                className={styles["password-input"]}
                {...register("password", {
                  required: "Password field is required.",
                  minLength: {
                    value: 6,
                    message: "Password required minimum 6 characters.",
                  },
                })}
                type={isShowPassword ? "text" : "password"}
                placeholder={"Must have at least 6 characters"}
                isInvalid={!!errors.password}
              />

              {isShowPassword ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Show Password</Tooltip>}
                >
                  <div
                    className={`${styles["visibility"]} ${
                      errors.password ? styles["invalid"] : ""
                    }`}
                    onClick={() => setIsShowPassword(false)}
                  >
                    <BsFillEyeFill />
                  </div>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Hide Password</Tooltip>}
                >
                  <div
                    className={`${styles["visibility"]} ${
                      errors.password ? styles["invalid"] : ""
                    }`}
                    onClick={() => setIsShowPassword(true)}
                  >
                    <BsFillEyeSlashFill />
                  </div>
                </OverlayTrigger>
              )}

              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="invalid-feedback d-block">{signInError}</div>
          </Card.Body>

          <Card.Footer>
            <LoadingButton
              title="Sign in"
              loadingTitle="Signing in..."
              isLoading={signInIsLoading}
              variant="warning"
              className={styles["sign-in-button"]}
              type="submit"
            />
          </Card.Footer>
        </Card>
      </Form>
    </div>
  );
};

export default SignIn;
