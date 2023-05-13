import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";

const CreateQuestionForm = () => {
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState([{ text: "", isCorrect: false }]);
  const handleAnswerChange = (event, index) => {
    const { name, value, checked } = event.target;
    const updatedAnswers = [...answers];
    if (name === "text") {
      updatedAnswers[index].text = value;
    } else {
      updatedAnswers[index].isCorrect = checked;
    }
    setAnswers(updatedAnswers);
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();
    const correctAnswers = answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.text);
    if (correctAnswers.length === 0) {
      console.log("A question must have at least one answer");
      return;
    }
    const allAnswers = answers.map(answer => answer.text)
    console.log({ title, answers:allAnswers, correctAnswers });
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
          width: "700px",
        }}
      >
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label>Question</Form.Label>
            <Form.Control
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              placeholder="Enter Question"
              required
            />
          </Form.Group>

          {answers.map((answer, idx) => (
            <Form.Group className="mb-3" key={idx}>
              <Form.Label>Answers Options</Form.Label>
              <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ gap: "20px" }}
              >
                <Form.Control
                  value={answer.text}
                  onChange={(event) => handleAnswerChange(event, idx)}
                  type="text"
                  name="text"
                  placeholder="Enter Answer"
                  required
                  id={idx + 1}
                />
                <Form.Check
                  type="checkbox"
                  label="Correct"
                  name="isCorrect"
                  checked={answer.isCorrect}
                  onChange={(event) => handleAnswerChange(event, idx)}
                />
              </div>
            </Form.Group>
          ))}
          <div className="mb-4 d-flex" style={{ gap: "5px" }}>
            <Button
              type="button"
              onClick={() =>
                setAnswers([...answers, { text: "", isCorrect: false }])
              }
              variant="outline-primary"
            >
              Add answer option
            </Button>
            {answers && answers.length > 1 && (
              <Button
                type="button"
                onClick={() => {
                  const updatedAnswers = [...answers];
                  updatedAnswers.pop();
                  setAnswers(updatedAnswers);
                }}
                variant="outline-secondary"
              >
                Remove last option
              </Button>
            )}
          </div>
          <Button
            style={{ display: "block", margin: "0 auto" }}
            variant="primary"
            type="submit"
          >
            Publish Question
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default CreateQuestionForm;
