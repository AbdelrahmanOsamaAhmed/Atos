import React, { useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_EXAM_URL } from "../../../Constants";
import { Card } from "react-bootstrap";
import DateFormatter from "../../../utils/DateFormatter";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userName, userType, userId, isLoggedIn } = useContext(AuthContext);
  const [examInstances, setExamInstances] = useState([]);

  useEffect(() => {
    const fetchExamInstances = async () => {
      const response = await axios.get(API_EXAM_URL + "instances", {
        params: {
          userId,
        },
      });
      const sortedData = response.data.sort((a, b) => {
        return new Date(a.schduledtimeFrom) - new Date(b.schduledtimeFrom);
      });
      setExamInstances(sortedData);
    };
    if (userId) fetchExamInstances();
  }, [userId]);
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  });
  return (
    <section style={{ padding: "120px 0px 50px" }} className="section-wrapper">
      <div>
        <div className="text-center">
          <p>username: {userName}</p>
          <p>userType: {userType}</p>
        </div>
        <div className="d-flex flex-wrap justify-content-center card-wrapper">
          {examInstances.length === 0 && userType === "STUDENT" && (
            <h3>No Exams</h3>
          )}
          {examInstances.map((exam, idx) => (
            <Card className="card" key={idx}>
              <Card.Body>
                <Card.Title>{exam.exam_definition.exam_name}</Card.Title>
                <p>Status: {exam.status}</p>
                <p>Your Score: {exam.score}</p>
                <p>Scheduled Until: {DateFormatter(exam.schduledtimeTo)}</p>
                {new Date() > new Date(exam.schduledtimeTo) && (
                  <p>You can no longer solve this exam</p>
                )}
                {exam.endTime && new Date() > new Date(exam.endTime) && (
                  <>
                    {exam.score > exam.exam_definition.passing_score && (
                      <p>Congrats you passed this exam</p>
                    )}
                    {exam.score < exam.exam_definition.passing_score && (
                      <p>Unfortunately you did not pass</p>
                    )}
                  </>
                )}
                <Link
                  className="link"
                  to={`/exams/${exam.id}`}
                  state={{ exam }}
                >
                  Go to Exam
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
