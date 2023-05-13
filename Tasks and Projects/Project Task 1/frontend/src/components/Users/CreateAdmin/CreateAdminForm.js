import React, {  useEffect } from "react";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { API_USERS_URL } from "../../../Constants";

const CreateAdminForm = () => {
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const userNameInput = userNameRef.current.value.trim();
    const passwordInput = userPasswordRef.current.value;
    try {
      const response = await axios.post(
        API_USERS_URL + "create-admin",
        {
          userName: userNameInput,
          password: passwordInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
    }
  };
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
              <Form.Label>Admin Username</Form.Label>
              <Form.Control
                ref={userNameRef}
                type="text"
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Admin Password</Form.Label>
              <Form.Control
                ref={userPasswordRef}
                type="password"
                placeholder="Password"
                required
              />
            </Form.Group>
            <Button
              style={{ display: "block", margin: "0 auto" }}
              variant="primary"
              type="submit"
            >
              Create Admin
            </Button>
          </Form>
        </div>
      </Container>
  );
};

export default CreateAdminForm;
