import React, { useEffect, useState } from "react";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_USERS_URL } from "../../../Constants";
import SuccessModal from "../../UI/Modal/SuccessModal";
import ErrorModal from "../../UI/Modal/ErrorModal";

const CreateAdminForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const navigate = useNavigate();
  const { token, isLoggedIn } = useContext(AuthContext);
  /* useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]); */
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const userNameInput = userName.trim();
    const passwordInput = password;
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
      setSuccessModal(true);
      setSuccessModalMessage(response.data.message);
    } catch (error) {
      setErrorModal(true);
      setErrorModalMessage(error.response.data.message);
    }
  };
  return (
    <section className="d-flex align-items-center justify-content-center secondary">
      <SuccessModal
        message={successModalMessage}
        show={successModal}
        onClose={() => {
          setSuccessModal(false);
          navigate("/profile");
        }}
      />
      <ErrorModal
        message={errorModalMessage}
        show={errorModal}
        onClose={() => {
          setErrorModal(false);
        }}
      />
      <div className="form">
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Admin Username</Form.Label>
            <Form.Control
              //ref={userNameRef}
              type="text"
              placeholder="Enter username"
              required
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Admin Password</Form.Label>
            <Form.Control
              //ref={userPasswordRef}
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <button
            style={{ display: "block", margin: "0 auto", height: "auto" }}
            className="navbar__btn"
            type="submit"
          >
            Create Admin
          </button>
        </Form>
      </div>
    </section>
  );
};

export default CreateAdminForm;
