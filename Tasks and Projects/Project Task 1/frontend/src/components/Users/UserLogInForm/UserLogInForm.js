import React, { useEffect } from "react";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "../../UI/Modal/ErrorModal";

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
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <ErrorModal
        message={authErrorMessage}
        show={authError}
        onClose={() => {
          setAuthError(false);
        }}
      />
      <div
        style={{
          padding: "40px",
          borderRadius: "20px",
          boxShadow:
            " rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
        }}
      >
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
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
          <Button
            style={{ display: "block", margin: "0 auto" }}
            variant="primary"
            type="submit"
          >
            Log in
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default UserLogInForm;
