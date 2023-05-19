import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API_QUESTIONS_URL, API_USERS_URL } from "../../../Constants";
import { AuthContext } from "../../../contexts/auth-context";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Button, Container } from "react-bootstrap";
import ErrorModal from "../../UI/Modal/ErrorModal";
import "../Questions.css";
const AllQuestions = () => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const { token } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [numberPerPage, setNumberPerPage] = useState(10);
  useEffect(() => {
    const fetchQuestion = async () => {
      let userId = "";
      if (createdBy) {
        try {
          const response = await axios.get(
            API_USERS_URL + `user-by-name/${createdBy}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.data) {
            setQuestions([]);
            return;
          }
          if (response.data) {
            userId = response.data._id;
          }
        } catch (error) {
          setErrorModal(true);
          setErrorModalMessage(
            error.response
              ? error.response.data.message
              : "An error has occurred. please try again later"
          );
        }
      }
      let url =
        API_QUESTIONS_URL +
        `?category=${category}&subCategory=${subCategory}&page=${page}&createdBy=${userId}&numberPerPage=${numberPerPage}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalPages(response.data.totalPages);
        setQuestions(response.data.questions);
      } catch (error) {
        setErrorModal(true);
        setErrorModalMessage(
          error.response
            ? error.response.data.message
            : "An error has occurred. please try again later"
        );
      }
    };
    token && fetchQuestion();
  }, [token, category, subCategory, page, createdBy, numberPerPage]);
  if (!questions) return <h1>No Questions</h1>;
  return (
    <>
      <section
        style={{ padding: "120px 0px 50px" }}
        className="section-wrapper"
      >
        <div className="search-form-background">
          <hr className="hr" />
          <div className="search-form-wrapper">
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicSubCategory">
              <Form.Label>Sub Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sub Category"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCreatedBy">
              <Form.Label>Created By</Form.Label>
              <Form.Control
                type="text"
                placeholder="Created By"
                value={createdBy}
                onChange={(e) => {
                  setCreatedBy(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCreatedBy">
              <Form.Label>Number Per Page:</Form.Label>
              <Form.Select
                style={{ minWidth: "200px" }}
                onChange={(event) => setNumberPerPage(event.target.value)}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </Form.Select>
            </Form.Group>
          </div>
          <hr className="hr" />
        </div>

        <ErrorModal
          message={errorModalMessage}
          show={errorModal}
          onClose={() => {
            setErrorModal(false);
          }}
        />

        <div className="d-flex flex-wrap justify-content-center card-wrapper">
          {questions.length === 0 && <h3>No Questions</h3>}
          {questions.map((question, idx) => (
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
              </Card.Body>
            </Card>
          ))}
        </div>
        <Container
          className="row mt-5 align-items-center justify-content-around mb-auto pages-btn"
          style={{ margin: "0 auto" }}
        >
          <button
            className="col-12 col-md-auto mb-3 mb-md-0 me-md-3 navbar__btn"
            onClick={() => {
              if (page > 1) setPage((page) => page - 1);
              else {
                setErrorModal(true);
                setErrorModalMessage("You cannot go to page 0!");
              }
            }}
          >
            Previous Page
          </button>
          <div className="col-12 col-md-6 text-center mb-3 mb-md-0 ">
            <span style={{ display: "inline-block", marginRight: "20px" }}>
              Current page: {page}
            </span>
            <span>Total Pages: {totalPages}</span>
          </div>
          <button
            className="col-12 col-md-auto navbar__btn"
            onClick={() => {
              if (page < totalPages) setPage((page) => page + 1);
              else {
                setErrorModal(true);
                setErrorModalMessage("This is the last page!");
              }
            }}
          >
            Next Page
          </button>
        </Container>
      </section>
    </>
  );
};

export default AllQuestions;
