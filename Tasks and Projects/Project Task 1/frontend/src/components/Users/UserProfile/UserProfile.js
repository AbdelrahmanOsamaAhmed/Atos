import React, { useEffect } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userName, userType, isLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  });
  return (
    <div
      className="d-flex align-items-center justify-content-center w-100"
      style={{ height: "100vh" }}
    >
      <div>
        <p>username: {userName}</p>
        <p>userType: {userType}</p>
      </div>
    </div>
  );
};

export default UserProfile;
