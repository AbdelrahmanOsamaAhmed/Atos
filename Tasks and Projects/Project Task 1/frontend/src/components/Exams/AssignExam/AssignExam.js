import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ExamQuestionCard from "../ExamQuestionCard/ExamQuestionCard";
import axios from "axios";
import {
  API_EXAM_URL,
  API_QUESTIONS_URL,
  API_USERS_URL,
} from "../../../Constants";
import { Card, Form } from "react-bootstrap";
import { AuthContext } from "../../../contexts/auth-context";
import SuccessModal from "../../UI/Modal/SuccessModal";

const ExamQuestionReviewCard = ({ id }) => {
  const [question, setQuestion] = useState();
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(API_QUESTIONS_URL + id);
        setQuestion(response.data);
      } catch (error) {}
    };
    fetchQuestion();
  }, [id]);

  if (!question) return null;
  return (
    <Card className="card">
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
  );
};

const AssignExam = () => {
  let { exam } = useLocation().state;
  const { token } = useContext(AuthContext);
  const [studentId, setStudentId] = useState("");
  const [students, setStudents] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      if (token) {
        try {
          const response = await axios.get(API_USERS_URL + "students", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStudents(response.data);
          setStudentId(response.data[0]._id);
        } catch (error) {}
      }
    };
    fetchQuestion();
  }, [token]);
  const examInstanceSubmitHandler = async (e) => {
    e.preventDefault();
    if (endTime < startTime) {
      alert("End time cannot be before start time");
      return;
    }
    try {
      const response = await axios.post(
        API_EXAM_URL + "instance",
        {
          exam,
          studentId,
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /* const { createdInstanceId } = response.data;
      const studentResponse = await axios.post(
        API_USERS_URL + "assign-instance",
        {
          studentId,
          examInstanceId: createdInstanceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      console.log("Success");
      setSuccessModal(true);
    } catch (error) {}
  };
  return (
    <section style={{ marginTop: "100px" }}>
      <SuccessModal
        message={"An exam instance has been assigned to this student "}
        show={successModal}
        onClose={() => {
          setSuccessModal(false);
          navigate("/exams/all-exams");
        }}
      />
      <h1>Review the exam</h1>
      <p>exam name: {exam.exam_name}</p>
      <p>passing score: {exam.passing_score}</p>
      <form
        onSubmit={examInstanceSubmitHandler}
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <Form.Group className="mt-5 px-4" controlId="formBasicCategory">
          <Form.Label>Student Name</Form.Label>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => {
              setStudentId(e.target.value);
            }}
          >
            {students.map((student, idx) => (
              <option key={idx} value={student._id}>
                {student.userName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-5 px-4" controlId="formBasicStartTime">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={startTime.toISOString().slice(0, -8)}
            onChange={(e) => setStartTime(new Date(e.target.value))}
          />
        </Form.Group>

        <Form.Group className="mt-5 px-4" controlId="formBasicEndTime">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={endTime.toISOString().slice(0, -8)}
            onChange={(e) => setEndTime(new Date(e.target.value))}
          />
        </Form.Group>

        <div className="d-flex flex-column align-items-center card-wrapper ">
          {exam.questions.map((q, idx) => (
            <ExamQuestionReviewCard key={idx} id={q.question_id} />
          ))}
        </div>
        <button
          className="navbar__btn"
          type="submit"
          style={{ margin: "0 auto", display: "block" }}
        >
          Assign this exam to student
        </button>
      </form>
    </section>
  );
};

export default AssignExam;
