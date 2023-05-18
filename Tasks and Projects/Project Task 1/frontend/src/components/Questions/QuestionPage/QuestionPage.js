import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API_QUESTIONS_URL } from "../../../Constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth-context";
import { Button, Container } from "react-bootstrap";
import SuccessModal from "../../UI/Modal/SuccessModal";
import ErrorModal from "../../UI/Modal/ErrorModal";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { userId, userType, token } = useContext(AuthContext);
  const { id } = useParams();
  const [question, setQuestion] = useState();
  const [successModal, setSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(API_QUESTIONS_URL + id);
        setQuestion(response.data);
      } catch (error) {
        setErrorModalMessage(
          error.response
            ? error.response.data.message
            : "An error has occurred. please try again later"
        );
        setErrorModal(true);
      }
    };
    fetchQuestion();
  }, [id]);
  const deleteHandler = async () => {
    try {
      const response = await axios.delete(
        API_QUESTIONS_URL + id,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessModalMessage(response.data.message);
      setSuccessModal(true);
    } catch (error) {
      setErrorModalMessage(
        error.response
          ? error.response.data.message
          : "An error has occurred. please try again later"
      );
      setErrorModal(true);
    }
  };

  if (!question)
    return (
      <div style={{ padding: "120px 50px 50px" }}>
        <p>Loading....</p>
      </div>
    );
  return (
    <div style={{ padding: "120px 50px 50px" }}>
      <SuccessModal
        message={successModalMessage}
        show={successModal}
        onClose={() => {
          setSuccessModal(false);
          navigate("/all-questions");
        }}
      />
      <ErrorModal
        message={errorModalMessage}
        show={errorModal}
        onClose={() => {
          setErrorModal(false);
        }}
      />
      <Container className="mb-5">
        <h2 className="mb-4">
          <span className="text-muted" style={{ fontSize: "22px" }}>
            Question:
          </span>{" "}
          {question.name}
        </h2>
        <ul>
          <h6 className="mb-4 text-muted">Options:</h6>
          {question.answers.map((answer, idx) => (
            <li key={idx}>
              <h6>{answer.description}</h6>
            </li>
          ))}
        </ul>
      </Container>
      {userType !== "STUDENT" && (
        <Container className="mb-5">
          <h4>Correct Answers</h4>
          {question.correctAnswers.map((correctAnswer, idx) => (
            <h6 key={idx}>{correctAnswer.description}</h6>
          ))}
        </Container>
      )}

      {question.createdBy === userId && (
        <Link
          className="btn btn-outline-primary"
          to={`/questions/update/${id}`}
        >
          Edit Question
        </Link>
      )}
      {userType === "ADMIN" && (
        <Button className="btn btn-outline-danger" onClick={deleteHandler}>
          Delete this question
        </Button>
      )}
    </div>
  );
};

export default QuestionPage;
