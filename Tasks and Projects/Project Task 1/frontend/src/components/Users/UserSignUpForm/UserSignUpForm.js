import React, { useState } from "react";
import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "../../UI/Modal/ErrorModal";

const UserSignUpForm = () => {
  const navigate = useNavigate();
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  const [userType, setUserType] = useState("STUDENT");
  const { signup, isLoggedIn, authError, authErrorMessage, setAuthError } =
    useContext(AuthContext);
  const onSubmitHandler = (event) => {
    event.preventDefault();
    const userNameInput = userNameRef.current.value.trim();
    const passwordInput = userPasswordRef.current.value;
    const userTypeInput = userType;
    signup(userNameInput, passwordInput, userTypeInput);
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

          <Form.Group className="mb-3" controlId="formBasicUserType">
            <Form.Label>User Type</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={(event) => setUserType(event.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </Form.Select>
          </Form.Group>

          <p>
            Already have an account?
            <Link
              className="link"
              to="/login"
              style={{ textDecoration: "none" }}
            >
              Log in
            </Link>
          </p>
          <button
            style={{ display: "block", margin: "0 auto", height: "auto" }}
            className="navbar__btn"
            type="submit"
          >
            Sign Up
          </button>
        </Form>
      </div>
    </section>
  );
};

export default UserSignUpForm;
