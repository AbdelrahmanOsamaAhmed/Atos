import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import axios from "axios";
import { API_QUESTIONS_URL } from "../../../Constants";
import { AuthContext } from "../../../contexts/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import SuccessModal from "../../UI/Modal/SuccessModal";
import ErrorModal from "../../UI/Modal/ErrorModal";

const CreateAndUpdateQuestionForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [mark, setMark] = useState();
  const [expectedTime, setExpectedTime] = useState();
  const [successModal, setSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([{ text: "", isCorrect: false }]);
  const { token } = useContext(AuthContext);
  /*   useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]); */
  const { id } = useParams();
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(API_QUESTIONS_URL + id);
        setName(response.data.name);
        setCategory(response.data.category);
        setSubCategory(response.data.subCategory);
        setMark(response.data.mark);
        setExpectedTime(response.data.expectedTime);
        const correctAnswersIds = response.data.correctAnswers.map(
          (answer) => answer._id
        );
        const mappedAnswers = response.data.answers.map((answer) => ({
          text: answer.description,
          isCorrect: correctAnswersIds.includes(answer._id),
        }));
        setAnswers(mappedAnswers);
      } catch (error) {
        setErrorModalMessage(
          error.response
            ? error.response.data.message
            : "An error has occurred. please try again later"
        );
      }
    };
    if (id) {
      fetchQuestion();
    }
  }, [id]);
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
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const correctAnswers = answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.text);
    if (correctAnswers.length === 0) {
      setErrorModalMessage("A question must have at least one correct answer");
      setErrorModal(true);
      return;
    }
    const question = {
      name,
      category: category.toLocaleLowerCase(),
      subCategory: subCategory.toLocaleLowerCase(),
      mark,
      expectedTime,
      answers,
    };
    try {
      if (id) {
        const response = await axios.patch(
          API_QUESTIONS_URL + "update-question",
          {
            question,
            id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessModalMessage(response.data.message);
        setSuccessModal(true);
      } else {
        const response = await axios.post(
          API_QUESTIONS_URL + "add-question",
          {
            question,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessModalMessage(response.data.message);
        setSuccessModal(true);
      }
    } catch (error) {
      setErrorModalMessage(
        error.response
          ? error.response.data.message
          : "An error has occurred. please try again later"
      );
      setErrorModal(true);
    }
  };
  if (id && !answers) return <p>Wait</p>;
  return (
    <section
      className="d-flex align-items-center justify-content-center secondary"
      style={{ height: "100vh" }}
    >
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
      <div
        className="form"
        style={{
          width: "700px",
          maxHeight: "600px",
          overflowY: "scroll",
        }}
      >
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label>Question</Form.Label>
            <Form.Control
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="Enter Question"
              required
            />
          </Form.Group>
          <div
            className="d-flex justify-content-center mb-4"
            style={{ gap: "8px", flexWrap: "wrap" }}
          >
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value.toLocaleLowerCase())
                }
                type="text"
                placeholder="Enter Category"
                required
                id="1"
                style={{ width: "180px" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sub Category</Form.Label>
              <Form.Control
                value={subCategory}
                onChange={(event) =>
                  setSubCategory(event.target.value.toLocaleLowerCase())
                }
                type="text"
                placeholder="Sub Category"
                id="2"
                required
                style={{ width: "180px" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Expected Time</Form.Label>
              <Form.Control
                value={expectedTime || ""}
                onChange={(event) => setExpectedTime(event.target.value)}
                type="number"
                placeholder="in minutes"
                required
                style={{ width: "120px" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mark</Form.Label>
              <Form.Control
                value={mark || ""}
                onChange={(event) => setMark(event.target.value)}
                type="number"
                placeholder="out of 10"
                required
                style={{ width: "80px" }}
              />
            </Form.Group>
          </div>
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
              variant="outline-secondary"
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
          <button
            style={{ display: "block", margin: "0 auto", height: "auto" }}
            className="navbar__btn"
            type="submit"
          >
            {!id && "Publish"}
            {id && "Update"} Question
          </button>
        </Form>
      </div>
    </section>
  );
};

export default CreateAndUpdateQuestionForm;
