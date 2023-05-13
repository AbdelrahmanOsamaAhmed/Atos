const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return next(new HttpError("Auth", 502));
    }
    const decodedToken = jwt.verify(token, "supersecret_jwt_token");
    req.userData = {
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      userType: decodedToken.userType,
    };
    next();
  } catch (error) {
    return next("Authentication failed", 401);
  }
};
