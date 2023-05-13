import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API_QUESTIONS_URL } from "../../../Constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth-context";
import { Button } from "react-bootstrap";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { userId, userType, token } = useContext(AuthContext);
  const { id } = useParams();
  const [question, setQuestion] = useState();
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
      navigate("/all-questions");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  if (!question) return <p>No available questions at the moment</p>;
  return (
    <>
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
