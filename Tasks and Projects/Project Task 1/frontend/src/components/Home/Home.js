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
        {!userType && (
          <>
            <h1>Unlock Your Learning Potential!</h1>
            <p>
              Our platform offers a vast selection of questions and quizzes that
              cover a wide range of topics.
            </p>
          </>
        )}
        {userType && userType !== "STUDENT" && (
          <>
            <h1>Unlock your students' potential!</h1>
            <p>Say goodbye to boring lessons with our dynamic question bank.</p>
            <button
              className="main__btn"
              onClick={() => navigate("/all-questions")}
            >
              See All Questions
            </button>
          </>
        )}
        {userType === "STUDENT" && (
          <>
            <h1>Get Ready to Ace Your Exams!</h1>
            <p>
              Prepare for exams and quizzes with ease. Our platform offers a
              vast selection of questions and quizzes that cover a wide range of
              topics.
            </p>
          </>
        )}
      </Container>
    </section>
  );
};

export default Home;
