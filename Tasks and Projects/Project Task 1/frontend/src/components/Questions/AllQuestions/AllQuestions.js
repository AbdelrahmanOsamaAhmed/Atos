import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API_QUESTIONS_URL } from "../../../Constants";
import { AuthContext } from "../../../contexts/auth-context";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";

const AllQuestions = () => {
  const { token } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestion = async () => {
      const response = await axios.get(API_QUESTIONS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(response.data);
    };
    token && fetchQuestion();
  }, [token]);
  if (!questions || questions.length === 0) return <h1>No Questions</h1>;
  return (
    <>
      <Container className="d-flex flex-wrap mt-4" style={{ gap: "10px" }}>
        {questions.map((question) => (
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{question.name}</Card.Title>
              <Card.Text>
                category: {question.category} <br /> subcategory:{" "}
                {question.subCategory}
              </Card.Text>
              <Link to={`/questions/${question._id}`}>Go to question</Link>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </>
  );
};

export default AllQuestions;
