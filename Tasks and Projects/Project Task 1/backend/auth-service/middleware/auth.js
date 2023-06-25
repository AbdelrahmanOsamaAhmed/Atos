const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(new HttpError("Auth", 502));
    }

    const [keycloakToken, userId] = token.split("+");
    const decodedToken = jwt.decode(keycloakToken);
    const userType = decodedToken.realm_access.roles.includes("TEACHER")
      ? "TEACHER"
      : "STUDENT";

    const userData = {
      userId,
      userName: decodedToken.preferred_username,
      userType,
    };

    req.userData = userData;
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed", 401));
  }
};
