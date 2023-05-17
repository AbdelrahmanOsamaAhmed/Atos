import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth-context";

const Home = () => {
  const { userType } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <section className="d-flex align-items-center justify-content-center main text-center">
      <Container className="main__wrapper">
        <h1>Welcome to your favourite question bank</h1>
        <p>The only place teachers need to post and share their questions.</p>
        {userType && userType !== "STUDENT" && (
          <button
            className="main__btn"
            onClick={() => navigate("/all-questions")}
          >
            See All Questions
          </button>
        )}
      </Container>
    </section>
  );
};

export default Home;
