const uuid = require("uuid/v4");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");



const getUsers = async (req, res, next) => {
  const users = await User.find({}, "-password");
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (existingUser)
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
    places:[],
  });
  createdUser.save();

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const emailWithoutDots = email.replace(/\.(?=[^@]*@)/g, "");
  console.log(emailWithoutDots);

  const identifiedUser = await User.findOne({ email: emailWithoutDots });
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  res.json({ user: identifiedUser, message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
