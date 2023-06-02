import React, { createContext, useCallback, useState } from "react";
import axios from "axios";
import { API_USERS_URL } from "../Constants";
import { client } from "../hooks/useKeyCloak";
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userName: null,
  userType: null,
  token: null,
  authError: null,
  authErrorMessage: null,
  setAuthError: () => {},
  login: () => {},
  logout: () => {},
  signup: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState("");
  const login = useCallback(async (userName, password) => {
    try {
      const response = await axios.post(API_USERS_URL + "login", {
        userName,
        password,
      });
      setToken(response.data.token);
      setUserName(response.data.userName);
      setUserId(response.data.userId);
      setUserType(response.data.userType);

      const tokenExpirationDate = new Date(
        new Date().getTime() + 1000 * 60 * 60
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          userName: response.data.userName,
          userId: response.data.userId,
          userType: response.data.userType,
          token: response.data.token,
          tokenExpirationDate,
        })
      );
    } catch (error) {
      setAuthError(true);
      setAuthErrorMessage(
        error.response
          ? error.response.data.message
          : "An error has occurred. please try again later"
      );
    }
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserName(null);
    setUserId(null);
    setUserType(null);
    localStorage.removeItem("user");
    client.logout();
  }, []);
  const signup = useCallback(async (userName, password, userType) => {
    try {
      const response = await axios.post(API_USERS_URL + "signup", {
        userName,
        password,
        userType,
      });
      setToken(response.data.token);
      setUserName(response.data.userName);
      setUserId(response.data.userId);
      setUserType(response.data.userType);
      const tokenExpirationDate = new Date(
        new Date().getTime() + 1000 * 60 * 60
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          userName: response.data.userName,
          userId: response.data.userId,
          userType: response.data.userType,
          token: response.data.token,
          tokenExpirationDate,
        })
      );
    } catch (error) {
      setAuthError(true);
      setAuthErrorMessage(
        error.response
          ? error.response.data.message
          : "An error has occurred. please try again later"
      );
    }
  }, []);
  const loginFromLocalStorage = useCallback(
    (userName, userId, userType, token, tokenExpirationDate) => {
      setUserName(userName);
      setUserId(userId);
      setUserType(userType);
      setToken(token);
    },
    []
  );
  const loginWithKeyCloak = useCallback(
    async (token, userName, userId, userType, tokenExpirationDate) => {
      try {
        setToken(token);
        setUserName(userName);
        setUserType(userType);

        const response = await axios.post(API_USERS_URL + "/keycloak", {
          userName,
          userType,
        });
        setUserId(response.data.userId);

        localStorage.setItem(
          "user",
          JSON.stringify({
            userName: userName,
            userId: response.data.userId,
            userType: userType,
            token: token,
            tokenExpirationDate,
          })
        );
      } catch (error) {
        setAuthError(true);
        setAuthErrorMessage(
          error.response
            ? error.response.data.message
            : "An error has occurred. please try again later"
        );
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId,
        userName,
        userType,
        token,
        login,
        signup,
        logout,
        loginFromLocalStorage,
        authError,
        setAuthError,
        authErrorMessage,
        loginWithKeyCloak,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
