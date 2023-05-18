import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, userType } = useContext(AuthContext);
  return (
    <Navbar
      className="w100 fixed-top "
      style={{ backgroundColor: "transparent" }}
      expand="lg"
    >
      <Container>
        <Link className="navbar__brand" to={"/"}>
          Home
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {!isLoggedIn && (
            <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
              <button
                className="navbar__btn"
                onClick={() => navigate("/signup")}
                variant="outline-primary"
              >
                Sign up
              </button>
              <button
                className="navbar__btn"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </div>
          )}
          {isLoggedIn && (
            <div className="d-flex navbar__btn-wrapper" style={{ gap: "10px" }}>
              {userType === "SUPER_ADMIN" && (
                <button
                  className="navbar__btn"
                  onClick={() => navigate("/create-admin")}
                >
                  Create Admin
                </button>
              )}
              {userType === "TEACHER" && (
                <button
                  className="navbar__btn"
                  onClick={() => navigate("/create-question")}
                >
                  Create Question
                </button>
              )}
              <button
                className="navbar__btn"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button
                className="navbar__btn"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                variant="outline-primary"
              >
                Logout
              </button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
