import React, { useContext, useState } from "react";
import { ExamContext } from "../../../contexts/exam-context";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import SuccessModal from "../../UI/Modal/SuccessModal";

const ExamSubmitForm = () => {
  //const navigate = useNavigate();

  const {
    examQuestions,
    examName,
    setExamName,
    postExam,
    deleteQuestionFromExam,
    passingScore,
    setPassingScore,
  } = useContext(ExamContext);
  return (
    <section style={{ padding: "120px 0px 50px" }} className="section-wrapper">
      {/* <SuccessModal
        message={"The exam definition was successfully submitted."}
        show={successModal}
        onClose={() => {
          setSuccessModal(false);
          navigate("/all-questions");
        }}
      /> */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 30px" }}>
        <h1>Review your exam</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            postExam();
          }}
        >
          <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Exam Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="exam name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Passing score %:</Form.Label>
            <Form.Control
              type="text"
              placeholder="passing score"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              required
            />
          </Form.Group>
          {examQuestions.length > 0 && (
            <button className="navbar__btn">Post your exam</button>
          )}
        </Form>
      </div>

      <div className="d-flex flex-wrap justify-content-center card-wrapper">
        {examQuestions.length === 0 && <h3>No Questions</h3>}
        {examQuestions.map((question, idx) => (
          <Card className="card" key={idx}>
            <Card.Body>
              <Card.Title>{question.name}</Card.Title>
              <Card.Text>
                category: {question.category} <br /> subcategory:{" "}
                {question.subCategory}
              </Card.Text>
              <Link className="link" to={`/questions/${question._id}`}>
                Go to question
              </Link>
              <br />
              <button
                className="navbar__btn mt-3"
                onClick={() => deleteQuestionFromExam(question)}
              >
                Delete
              </button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExamSubmitForm;
