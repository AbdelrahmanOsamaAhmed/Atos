import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth-context";

const Home = () => {
  const { userType } = useContext(AuthContext);
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      {userType !== "STUDENT" && <Link to={'/all-questions'}>See All Questions</Link>}
    </Container>
  );
};

export default Home;
