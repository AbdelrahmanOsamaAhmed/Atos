import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './NavBar.css'

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, userType } = useContext(AuthContext);
  return (
    <div className="w100 fixed-top" style={{ backgroundColor: "transparent" }}>
      <Container className="d-flex justify-content-between p-3">
        
          <Link className="navbar__brand" style={{ marginTop: "10px" }} to={"/"}>
            Home
          </Link>
        {!isLoggedIn && (
          <div className="d-flex" style={{ gap: "5px" }}>
            <button
              className="navbar__btn"
              onClick={() => navigate("/signup")}
              variant="outline-primary"
            >
              Sign up
            </button>
            <button
              className="navbar__btn" onClick={() => navigate("/login")}>Log in</button>
          </div>
        )}
        {isLoggedIn && (
          <div className="d-flex" style={{ gap: "10px" }}>
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
      </Container>
    </div>
  );
};

export default NavBar;
