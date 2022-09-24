import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";

import { selectCurrentUser } from "../../store/user/user.selector";
import { signOutStart } from "../../store/user/user.action";
import styles from "./navigation_layout.module.scss";

const NavigationLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const brandName =
    process.env.REACT_APP_BRAND_NAME?.replace(/_/g, " ") || "CM Catalogue";

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="warning"
        className={styles["header-container"]}
      >
        <Container>
          <Link to="/">
            <Navbar.Brand className={styles["header-brand"]}>
              <img alt="logo" src="/images/logo.png" width="50" height="50" />
              <span className="ms-3">{brandName}</span>
            </Navbar.Brand>
          </Link>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className={`ms-auto ${
              location.pathname === "/auth/sign-in" ? "d-none" : ""
            }`}
          />
          <Navbar.Collapse>
            {currentUser ? (
              <>
                <Nav className="ms-auto">
                  <Nav.Link as="span">
                    <Link to="/categories">Categories</Link>
                  </Nav.Link>
                </Nav>

                <Nav>
                  <Nav.Link as="span">
                    <Link to="/customers">Customers</Link>
                  </Nav.Link>
                </Nav>

                <Nav className="d-none d-lg-block">
                  <NavDropdown
                    title={
                      <span>
                        <BsPersonCircle className={styles["user-icon"]} />
                        {currentUser.displayName}
                      </span>
                    }
                  >
                    <NavDropdown.Item
                      as="div"
                      onClick={() => dispatch(signOutStart())}
                    >
                      <span className={styles["sign-out"]}>Sign Out</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>

                <Nav className="d-lg-none">
                  <Nav.Link onClick={() => dispatch(signOutStart())}>
                    <span className={styles["sign-out"]}>Sign Out</span>
                  </Nav.Link>
                </Nav>
              </>
            ) : (
              <Nav
                className={`ms-auto ${
                  location.pathname === "/auth/sign-in" ? "d-none" : ""
                }`}
              >
                <Nav.Link as="span">
                  <Link to="/auth/sign-in">Sign In</Link>
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div id="content-wrapper" className={styles["content-wrapper"]}>
        <Outlet />
      </div>
    </>
  );
};

export default NavigationLayout;
