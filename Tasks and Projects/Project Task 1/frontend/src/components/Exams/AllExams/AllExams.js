import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_EXAM_URL } from "../../../Constants";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const AllExams = () => {
  const [exams, setExams] = useState([]);
  useEffect(() => {
    const fetchExams = async () => {
      const response = await axios.get(API_EXAM_URL);
      setExams(response.data);
    };
    fetchExams();
  }, []);
  return (
    <section style={{ marginTop: "100px" }}>
      <h1>Exams</h1>
      <div className="d-flex flex-wrap justify-content-center card-wrapper">
        {exams.length === 0 && <h3>No Exams</h3>}
        {exams.map((exam, idx) => (
          <Card className="card" key={idx}>
            <Card.Body>
              <Card.Title>{exam.exam_name}</Card.Title>
              <Link
                className="link"
                to={`/exams/assign-exam/${exam.id}`}
                state={{ exam }}
              >
                Go to Exam
              </Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AllExams;
