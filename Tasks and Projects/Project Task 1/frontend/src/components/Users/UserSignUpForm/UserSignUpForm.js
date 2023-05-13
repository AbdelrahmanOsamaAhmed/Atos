import React, { useState } from "react";
import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const UserSignUpForm = () => {
  const navigate = useNavigate();
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  const [userType, setUserType] = useState("STUDENT");
  const { signup, isLoggedIn } = useContext(AuthContext);
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const userNameInput = userNameRef.current.value.trim();
      const passwordInput = userPasswordRef.current.value;
      const userTypeInput = userType;
      signup(userNameInput, passwordInput, userTypeInput);
    } catch (error) {}
  };
  useEffect(() => {
    if (isLoggedIn) navigate("/profile");
  }, [isLoggedIn, navigate]);
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
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
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "none" }}>
              Log in
            </Link>
          </p>
          <Button
            style={{ display: "block", margin: "0 auto" }}
            variant="primary"
            type="submit"
          >
            Sign Up
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default UserSignUpForm;
