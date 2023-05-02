const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const DUMMY_USER = [
  { id: "u1", name: "Abdelrahman", email: "1@2.com", password: "123" },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USER });
};
const signup = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) throw new HttpError("Invalid Inputs", 422);
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USER.find((user) => user.email === email);
  if (hasUser) throw new HttpError("Cannot sign up, email already exists", 422);
  const createdUser = {
    id: uuid(),
    name: name,
    email: email,
    password: password,
  };
  DUMMY_USER.push(createdUser);
  res.status(201).json({ user: createdUser });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  const indentifiedUser = DUMMY_USER.find((user) => user.email === email);
  if (!indentifiedUser || indentifiedUser.password === password)
    throw new HttpError("Could not find user or wrong Credentials.", 401);
  res.json({ message: "Logged in successfully" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
