import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_EXAM_URL } from "../../../Constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ExamQuestionCard from "../ExamQuestionCard/ExamQuestionCard";
import { AuthContext } from "../../../contexts/auth-context";
import SuccessModal from "../../UI/Modal/SuccessModal";

const ExamPage = () => {
  //const [exam, setExam] = useState();
  const [submittedExam, setSubmittedExam] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const location = useLocation();
  const { id } = useParams();
  const { userId } = useContext(AuthContext);
  const [exam, setExam] = useState(useLocation().state);
  const [disable, setDisable] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  /**
   * TODO:
   * 1- check if the user is the same with the id in the exam and check that the current time is before the scheduledTo time for the exam --- done
   * 2- update the start time in the database --- done
   * 3- update the end time --- done
   * 4- update the status to attended --- done
   * 5- evaluate the answers upon sumbitting (could be in backend)
   * 6- add auto submission after an hour from the start time
   * 7- update the score to the obtained score
   */

  useEffect(() => {
    const updateTime = async () => {
      const response = await axios.post(
        API_EXAM_URL + "update-start-time/" + exam.id
      );
      const updatedExam = await axios.get(API_EXAM_URL + "instance/" + exam.id);
      setExam(updatedExam.data);
    };
    const dateNow = new Date();
    const scheduledTo = new Date(exam.schduledtimeTo);
    const endTime = exam.endTime ? new Date(exam.endTime) : null;

    if (exam && !exam.startTime) updateTime();
    if (dateNow >= scheduledTo || (endTime && dateNow >= endTime)) {
      setDisable(true);
      return;
    }
  }, [exam]);
  const updateSelectedAnswers = (question) => {
    setSelectedAnswers((prev) => [
      ...prev,
      {
        question_id: question._id,
        correctAnswers: question.correctAnswers,
        selectedAnswers: question.selectedAnswers,
        mark: question.mark,
      },
    ]);
  };
  const submitExamHandler = async () => {
    const examInstance = {
      takenBy: userId,
      selectedAnswers,
      exam_instance_id: id,
    };
    setSuccessModal(true);
    try {
      const response = await axios.post(
        API_EXAM_URL + "/grade-exam/" + exam.id,
        {
          examInstance,
        }
      );
    } catch (error) {}
  };

  if (!exam) return null;
  if (exam.takenBy !== userId) return null;
  return (
    <section style={{ padding: "120px 0px 50px" }} className="section-wrapper">
      <SuccessModal
        message={"Your answers have been submitted, Good luck!"}
        show={successModal}
        onClose={() => {
          setSuccessModal(false);
          navigate("/profile");
        }}
      />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 30px" }}>
        <h1>{exam.exam_name}</h1>
      </div>
      <div className="d-flex flex-column align-items-center card-wrapper ">
        {exam.exam_definition.questions.map((q, idx) => (
          <ExamQuestionCard
            updateSelectedAnswers={updateSelectedAnswers}
            key={idx}
            id={q.question_id}
            disable={disable}
          />
        ))}
      </div>
      <button
        style={{ margin: "0 auto", display: "block" }}
        onClick={submitExamHandler}
        className={disable ? "btn btn-outline-secondary" : "navbar__btn"}
        disabled={disable}
      >
        Submit your answers
      </button>
    </section>
  );
};

export default ExamPage;
