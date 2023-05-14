import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API_QUESTIONS_URL } from "../../../Constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth-context";
import { Button } from "react-bootstrap";
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
        console.log(error);
      }
    };
    fetchQuestion();
  }, [userId, id]);
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
      setErrorModalMessage(error.response.data.message);
      setErrorModal(true);
    }
  };

  if (!question) return <p>No available questions at the moment</p>;
  return (
    <>
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
      {question.createdBy === userId && (
        <Link to={`/questions/update/${id}`}>Edit</Link>
      )}
      {userType === "ADMIN" && (
        <Button onClick={deleteHandler}>Delete this question</Button>
      )}
    </>
  );
};

export default QuestionPage;
