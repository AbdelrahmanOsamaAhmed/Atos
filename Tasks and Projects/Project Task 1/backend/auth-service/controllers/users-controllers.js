const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/super-admin");

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
  console.log(userType);
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
    default:
      return next(new HttpError("Undefined user type", 500));
  }
  try {
    await createdUser.save();
  } catch (error) {
    return next(
      new HttpError("An error has occured, Please try again later", 500)
    );
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
    return next(
      new HttpError("An error has occured, Please try again later", 500)
    );
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
  if (req.userData.userType !== "SUPER_ADMIN") {
    return next(new HttpError("Only Super Admins can do that", 500));
  }
  try {
    users = await User.find({});
  } catch (error) {
    return new HttpError("An error has occured, Please try again later", 500);
  }

  res.status(200).json(users);
};
const getAllStudents = async (req, res, next) => {
  let users;
  try {
    users = await User.find({ userType: "STUDENT" }, { userName: 1, _id: 1 });
  } catch (error) {
    return new HttpError("An error has occured, Please try again later", 500);
  }

  res.status(200).json(users);
};
const createAdmin = async (req, res, next) => {
  const { userName, password } = req.body;

  if (req.userData.userType !== "SUPER_ADMIN") {
    return next(new HttpError("Only Super Admins can do that", 500));
  }

  const existingUser = await User.findOne({ userName: userName });
  if (existingUser) {
    return next(
      new HttpError(
        "This User already exists, either log in or change the username",
        401
      )
    );
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError("An error has occured, Please try again later", 500)
    );
  }

  let user;
  try {
    user = new Admin({
      userName,
      password: hashedPassword,
    });
    await user.save();
    const updatedSuperAdmin = await User.findById(req.userData.userId);
    await updatedSuperAdmin.createdAdmins.push(user._id);
    await updatedSuperAdmin.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("An error has occured, Please try again later", 500)
    );
  }

  res.status(201).json({
    message: "Successfully created",
    user: user,
  });
};
const tokenVerifier = (req, res, next) => {
  res.json(req.userData);
};
const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const fetchedUser = await SuperAdmin.findById(userId);
  res.json(fetchedUser.toObject({ getters: true }));
};
const getUserByUserName = async (req, res, next) => {
  try {
    const userName = req.params.name;
    const fetchedUser = await User.findOne({ userName: userName });
    res.json(fetchedUser);
  } catch (error) {
    return next(
      new HttpError("An error has occured, Please try again later", 500)
    );
  }
};
const assignExamInstanceToStudent = async (req, res, next) => {
  const { studentId, examInstanceId } = req.body;
  try {
    const student = await Student.findById(studentId);
    student.examInstances.push(examInstanceId);
    await student.save();
    res.status(200).json({ messege: "Successfully assigned" });
  } catch (error) {
    return next(
      new HttpError("An error has occured, Please try again later", 500)
    );
  }
};

exports.addKeyCloakUserNameToDataBase = async (req, res, next) => {
  const { userName, userType } = req.body;
  try {
    let user = await User.findOne({ userName });

    if (user) {
      user.userType = userType;
      await user.save();
    } else {
      user = new User({ userName, userType });
      await user.save();
    }

    res.json({
      message: "User successfully updated/created",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};
exports.login = login;
exports.signup = signup;
exports.getAllUsers = getAllUsers;
exports.createAdmin = createAdmin;
exports.tokenVerifier = tokenVerifier;
exports.getUserById = getUserById;
exports.getUserByUserName = getUserByUserName;
exports.getAllStudents = getAllStudents;
exports.assignExamInstanceToStudent = assignExamInstanceToStudent;
