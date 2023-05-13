import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, userType } = useContext(AuthContext);
  return (
    <div className="bg-light w100" style={{position:'sticky',top:'0'}}>
      <Container className="d-flex justify-content-between p-3">
        <div className="d-flex align-items-center" style={{ height: "100%" }}>
          <Link style={{ marginTop: "6px", textDecoration: "none" }} to={"/"}>
            Home
          </Link>
        </div>
        {!isLoggedIn && (
          <div className="d-flex" style={{ gap: "5px" }}>
            <Button
              onClick={() => navigate("/signup")}
              variant="outline-primary"
            >
              Sign up
            </Button>
            <Button onClick={() => navigate("/login")}>Log in</Button>
          </div>
        )}
        {isLoggedIn && (
          <div className="d-flex" style={{ gap: "5px" }}>
            {userType === "SUPER_ADMIN" && (
              <Button onClick={() => navigate("/create-admin")}>
                Create Admin
              </Button>
            )}
            {userType === "TEACHER" && (
              <Button onClick={() => navigate("/create-question")}>
                Create Question
              </Button>
            )}
            <Button onClick={() => navigate("/profile")}>Profile</Button>
            <Button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              variant="outline-primary"
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default NavBar;
