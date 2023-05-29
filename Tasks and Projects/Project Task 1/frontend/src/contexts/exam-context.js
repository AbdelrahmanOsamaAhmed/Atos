import axios from "axios";
import { createContext, useContext, useState } from "react";
import { API_EXAM_URL } from "../Constants";
import { AuthContext } from "./auth-context";

export const ExamContext = createContext({
  examQuestions: [],
  setExamQuestions: () => {},
  examName: "",
  setExamName: () => {},
  passingScore: 50,
  setPassingScore: () => {},
  postExam: () => {},
  addQuestionToExam: () => {},
  deleteQuestionFromExam: () => {},
});

const ExamContextProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [examName, setExamName] = useState("");
  const [examQuestions, setExamQuestions] = useState([]);
  const [passingScore, setPassingScore] = useState(50);

  const addQuestionToExam = (question) => {
    setExamQuestions((prev) => [...prev, question]);
  };
  const deleteQuestionFromExam = (question) => {
    const filteredQuestions = examQuestions.filter(
      (q) => q._id !== question._id
    );
    setExamQuestions(filteredQuestions);
  };

  const postExam = async () => {
    const exam = {
      examName,
      examQuestions,
      passingScore,
    };
    try {
      axios.post(
        API_EXAM_URL,
        {
          exam,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExamName("")
      setExamQuestions([])
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ExamContext.Provider
      value={{
        examName,
        setExamName,
        examQuestions,
        addQuestionToExam,
        passingScore,
        setPassingScore,
        postExam,
        deleteQuestionFromExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};
export default ExamContextProvider;
