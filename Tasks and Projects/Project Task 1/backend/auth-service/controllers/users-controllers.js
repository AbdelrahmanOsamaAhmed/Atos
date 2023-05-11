const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const { userName, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ userName: userName });
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }
  if (!existingUser) {
    return next(new HttpError("No user matches this user name", 401));
  }
  let passwordIsValid;
  try {
    passwordIsValid = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }
  if (!passwordIsValid) {
    return next(new HttpError("Wrong password", 401));
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        userName: existingUser.userName,
        userType: existingUser.userType,
      },
      "supersecret_jwt_token",
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }

  res.status(201).json({
    userId: existingUser.id,
    userName: existingUser.userName,
    userType: existingUser.userType,
    token: token,
  });
};
const signup = async (req, res, next) => {
  const { userName, password, userType } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ userName: userName });
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }
  if (existingUser) {
    return next(new HttpError("This user already exists, Login instead", 422));
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }
  const credentials = { userName, password: hashedPassword };
  let createdUser;
  switch (userType) {
    case "STUDENT":
      createdUser = new Student({
        ...credentials,
      });
      break;
    case "TEACHER":
      createdUser = new Teacher({
        ...credentials,
      });
      break;
    case "ADMIN":
      createdUser = new Admin({
        ...credentials,
      });
      break;
    case "SUPER-ADMIN":
      return next(new HttpError("You cannot create a user of this type", 500));
    default:
      return next(new HttpError("Undefined user type", 500));
  }
  try {
    await createdUser.save();
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        userName: createdUser.userName,
        userType: createdUser.userType,
      },
      "supersecret_jwt_token",
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }

  res.status(201).json({
    userId: createdUser.id,
    userName: createdUser.userName,
    userType: createdUser.userType,
    token: token,
  });
};
const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (error) {
    new HttpError("An error has occured, Please try again later", 500);
  }

  res.status(200).json(users);
};
exports.login = login;
exports.signup = signup;
exports.getAllUsers = getAllUsers;