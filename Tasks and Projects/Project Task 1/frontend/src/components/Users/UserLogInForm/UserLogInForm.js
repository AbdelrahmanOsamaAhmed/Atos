import React, { useEffect } from "react";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "../../UI/Modal/ErrorModal";
import "../Form.css";

const UserLogInForm = () => {
  const navigate = useNavigate();
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  const { login, isLoggedIn, authError, authErrorMessage, setAuthError } =
    useContext(AuthContext);
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const userNameInput = userNameRef.current.value.trim();
    const passwordInput = userPasswordRef.current.value;
    login(userNameInput, passwordInput);
  };
  useEffect(() => {
    if (isLoggedIn) navigate("/profile");
  }, [isLoggedIn, navigate]);

  return (
    <section className="d-flex align-items-center justify-content-center secondary">
      <ErrorModal
        message={authErrorMessage}
        show={authError}
        onClose={() => {
          setAuthError(false);
        }}
      />
      <div className="form">
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              ref={userNameRef}
              type="text"
              placeholder="Enter username"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              ref={userPasswordRef}
              type="password"
              placeholder="Password"
              required
            />
          </Form.Group>

          <p>
            Don't have an account?{" "}
            <Link className="link" to="/signup" style={{ textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
          <button
            style={{ display: "block", margin: "0 auto", height: "auto" }}
            className="navbar__btn"
            type="submit"
          >
            Log in
          </button>
        </Form>
      </div>
    </section>
  );
};

export default UserLogInForm;
