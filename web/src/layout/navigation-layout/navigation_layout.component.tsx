import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { selectCurrentUser } from "../../store/user/user.selector";
import { signOutStart } from "../../store/user/user.action";
import styles from "./navigation_layout.module.scss";

const NavigationLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const brandName = process.env.REACT_APP_BRAND_NAME || "CM Catalogue";

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
                  <NavDropdown title="Categories">
                    <NavDropdown.Item as="div">
                      <Link to="/categories/add-category">
                        Add Category - 添加分类
                      </Link>
                    </NavDropdown.Item>
                    {/* <NavDropdown.Divider /> */}
                  </NavDropdown>
                </Nav>

                <Nav>
                  <Nav.Link as="span">
                    <Link to="/customers">Customers</Link>
                  </Nav.Link>
                </Nav>

                <Nav>
                  <NavDropdown title={currentUser.displayName}>
                    <NavDropdown.Item as="div">
                      <span
                        className={styles["sign-out"]}
                        onClick={() => dispatch(signOutStart())}
                      >
                        Sign Out
                      </span>
                    </NavDropdown.Item>
                  </NavDropdown>
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
      <Outlet />
    </>
  );
};

export default NavigationLayout;
