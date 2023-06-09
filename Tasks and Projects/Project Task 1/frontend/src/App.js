import Home from "./components/Home/Home";
import UserLogInForm from "./components/Users/UserLogInForm/UserLogInForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSignUpForm from "./components/Users/UserSignUpForm/UserSignUpForm";
import UserProfile from "./components/Users/UserProfile/UserProfile";
import NavBar from "./components/UI/NavBar/NavBar";
import CreateAdminForm from "./components/Users/CreateAdmin/CreateAdminForm";
import { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/auth-context";
import CreateAndUpdateQuestionForm from "./components/Questions/CreateQuestion/CreateAndUpdateQuestionForm";
import AllQuestions from "./components/Questions/AllQuestions/AllQuestions";
import QuestionPage from "./components/Questions/QuestionPage/QuestionPage";
import ExamSubmitForm from "./components/Exams/ExamSubmitForm/ExamSubmitForm";
import ExamPage from "./components/Exams/ExamPage/ExamPage";
import AssignExam from "./components/Exams/AssignExam/AssignExam";
import AllExams from "./components/Exams/AllExams/AllExams";
import useKeyCloak from "./hooks/useKeyCloak";
import { io } from "socket.io-client";
import axios from "axios";
import { API_EXAM_URL } from "./Constants";

function App() {
  const [
    isLoggedIn,
    keyCloakToken,
    userId,
    userName,
    userType,
    tokenExpirationDate,
  ] = useKeyCloak();
  const {
    loginFromLocalStorage,
    token,
    logout,
    loginWithKeyCloak,
    userId: socketUserId,
  } = useContext(AuthContext);
  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    if (userFromLocalStorage) {
      loginFromLocalStorage(
        userFromLocalStorage.userName,
        userFromLocalStorage.userId,
        userFromLocalStorage.userType,
        userFromLocalStorage.token,
        userFromLocalStorage.tokenExpirationDate
      );
    }
    if (isLoggedIn) {
      loginWithKeyCloak(
        keyCloakToken,
        userName,
        userId,
        userType,
        tokenExpirationDate
      );
    }
  }, [
    loginFromLocalStorage,
    keyCloakToken,
    userName,
    isLoggedIn,
    loginWithKeyCloak,
    tokenExpirationDate,
    userId,
    userType,
  ]);

  /* // This code for automatically logging out, not fully compatible with keycloak
  useEffect(() => {
    if (token) {
      const remainingTime =
        new Date(
          JSON.parse(localStorage.getItem("user")).tokenExpirationDate
        ).getTime() - new Date().getTime();

      const timeout = setTimeout(logout, remainingTime);
      return () => clearTimeout(timeout);
    }
  }, [token, logout]); */

  /* useEffect(() => {
    const socketStart = async () => {
      if (socketUserId && userType === "STUDENT") {
        await axios.get(API_EXAM_URL + "check-assigned-exams/" + socketUserId);
        const socket = io("http://localhost:3001");
        socket.on(socketUserId, (data) => {
          alert(data);
        });
      }
    };
    socketStart();
  }, [socketUserId]); */

  if (!isLoggedIn) return <>Notloggedin</>;

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<UserLogInForm />} />
        <Route path="/signup" element={<UserSignUpForm />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/create-admin" element={<CreateAdminForm />} />
        <Route
          path="/create-question"
          element={<CreateAndUpdateQuestionForm />}
        />
        <Route path="/all-questions" element={<AllQuestions />} />
        <Route path="/questions/:id" element={<QuestionPage />} />
        <Route path="/exams/submit" element={<ExamSubmitForm />} />
        <Route path="/exams/all-exams" element={<AllExams />} />
        <Route path="/exams/:id" element={<ExamPage />} />
        <Route path="/exams/assign-exam/:id" element={<AssignExam />} />
        <Route
          path="/questions/update/:id"
          element={<CreateAndUpdateQuestionForm />}
        />
      </Routes>
    </Router>
  );
}

export default App;
