import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_QUESTIONS_URL } from "../../../Constants";
import { Card } from "react-bootstrap";

const ExamQuestionCard = ({ id, updateSelectedAnswers, disable }) => {
  const [question, setQuestion] = useState();
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(API_QUESTIONS_URL + id);
        setQuestion(response.data);
      } catch (error) {}
    };
    fetchQuestion();
  }, [id]);

  const handleAnswerSelect = (answerId) => {
    if (question.correctAnswers.length === 1) {
      setSelectedAnswers([answerId]);
    } else {
      const index = selectedAnswers.indexOf(answerId);
      if (index === -1) {
        setSelectedAnswers([...selectedAnswers, answerId]);
      } else {
        setSelectedAnswers([
          ...selectedAnswers.slice(0, index),
          ...selectedAnswers.slice(index + 1),
        ]);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisableSubmitButton(true);
    updateSelectedAnswers({
      _id: question._id,
      correctAnswers: question.correctAnswers,
      mark: question.mark,
      selectedAnswers: selectedAnswers,
    });
  };

  if (!question) return null;

  return (
    <form className="w-100" onSubmit={handleSubmit}>
      <Card className="card w-100 p-3">
        <Card.Body>
          <Card.Title className="mb-4">{question.name}</Card.Title>
          <div>
            {question.answers.map((answer, idx) => (
              <div key={idx} className="form-check">
                <input
                  className="form-check-input"
                  type={
                    question.correctAnswers.length === 1 ? "radio" : "checkbox"
                  }
                  id={`answer-${answer._id}`}
                  value={answer.description}
                  onChange={() => handleAnswerSelect(answer._id)}
                  checked={selectedAnswers.includes(answer._id)}
                  disabled={disableSubmitButton || disable}
                />
                <label
                  className="form-check-label"
                  htmlFor={`answer-${answer._id}`}
                >
                  {answer.description}
                </label>
              </div>
            ))}
          </div>
          <br />
          <button
            type="submit"
            className={
              disableSubmitButton || disable
                ? "btn btn-outline-secondary"
                : "navbar__btn"
            }
            disabled={disableSubmitButton || disable}
          >
            Submit
          </button>
        </Card.Body>
      </Card>
    </form>
  );
};

export default ExamQuestionCard;
