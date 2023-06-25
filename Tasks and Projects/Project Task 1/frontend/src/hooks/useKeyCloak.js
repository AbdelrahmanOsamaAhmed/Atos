import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import { KEYCLOAK_CLIENT, KEYCLOAK_REALM, KEYCLOAK_URL } from "../Constants";

export const client = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT,
});
const useKeyCloak = () => {
  const isRun = useRef(false);
  const [keyCloakToken, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);
  const [userType, setUserType] = useState("STUDENT");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;
    client
      .init({
        onLoad: "login-required",
      })
      .then((res) => {
        setTokenExpirationDate(new Date(client.tokenParsed.exp * 1000));
        if (client.realmAccess.roles.includes("TEACHER"))
          setUserType("TEACHER");
        setUserId(client.subject);
        setLogin(res);
        setToken(client.token);
        setUserName(client.tokenParsed.preferred_username);
      });
  }, []);

  return [
    isLogin,
    keyCloakToken,
    userId,
    userName,
    userType,
    tokenExpirationDate,
  ];
};
export default useKeyCloak;
