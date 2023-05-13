const Question = require("../models/question");
const HttpError = require("../models/http-error");
const axios = require("axios");
const mongoose = require("mongoose");
const { response } = require("express");
const { ObjectId } = mongoose.Types;

const tokenVerifier = async (token) => {
  const response = await axios.get(
    "http://localhost:5000/api/users/token-verifier",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const addQuestion = async (req, res, next) => {
  const { question } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const { userId, userType } = await tokenVerifier(token);

  const {
    name,
    category,
    subCategory,
    mark,
    expectedTime,
    answers: questionAnswers,
  } = question;
  const answers = [],
    correctAnswers = [];

  if (userType !== "TEACHER") {
    return next(
      new HttpError("Only users of type teacher can create questions", 500)
    );
  }

  try {
    for (let answer of questionAnswers) {
      const answerObject = {
        _id: new mongoose.Types.ObjectId(),
        description: answer.text,
      };
      answers.push(answerObject);
      if (answer.isCorrect) {
        correctAnswers.push(answerObject);
      }
    }
    const createdQuestion = new Question({
      ...question,
      createdBy: new mongoose.Types.ObjectId(userId),
      answers,
      correctAnswers,
      createdAt: new Date(),
    });
    await createdQuestion.save();
    res.status(200).json({
      createdQuestion,
      message: "Success",
    });
  } catch (error) {
    return next(
      new HttpError(
        "An error occurred while saving the question, Please Try again",
        401
      )
    );
  }
};

const getAllQuestions = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const { userType } = await tokenVerifier(token);
  if (userType === "STUDENT") {
    return next(new HttpError("Students cant access this end point", 500));
  }
  try {
    const fetchedQuestions = await Question.find(
      {},
      { _id: 1, name: 1, category: 1, subCategory: 1 }
    );
    res.status(200).json(fetchedQuestions);
  } catch (error) {
    return next(
      new HttpError(
        "An error occurred while saving the question, Please Try again",
        401
      )
    );
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fetchedQuestion = await Question.findById(id);
    res.status(200).json(fetchedQuestion);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "An error occurred while saving the question, Please Try again",
        401
      )
    );
  }
};
const updateQuestion = async (req, res, next) => {
  const { question, id } = req.body;

  const token = req.headers.authorization.split(" ")[1];
  const { userId } = await tokenVerifier(token);
  const fetchedQuestion = await Question.findById(id);
  if (fetchedQuestion.createdBy.toString() !== userId) {
    return next(
      new HttpError(
        "Only the teacher who created the question can update it.",
        401
      )
    );
  }
  const answers = [],
    correctAnswers = [];
  for (let answer of question.answers) {
    const answerObject = {
      _id: new mongoose.Types.ObjectId(),
      description: answer.text,
    };
    answers.push(answerObject);
    if (answer.isCorrect) {
      correctAnswers.push(answerObject);
    }
  }
  fetchedQuestion.answers = answers;
  fetchedQuestion.correctAnswers = correctAnswers;
  fetchedQuestion.category = question.category;
  fetchedQuestion.subCategory = question.subCategory;
  fetchedQuestion.expectedTime = question.expectedTime;
  fetchedQuestion.mark = question.mark;
  fetchedQuestion.name = question.name;
  fetchedQuestion.save();

  console.log(correctAnswers);

  res.json({ message: "UPDATING" });
};

const deleteQuestion = async (req, res, next) => {
  const { id } = req.params;

  const token = req.headers.authorization.split(" ")[1];

  const { userType } = await tokenVerifier(token);
  if (userType !== "ADMIN") {
    return next(new HttpError("Only admins can delete questions", 500));
  }

  const fetchedQuestion = await Question.findById(id);
  await fetchedQuestion.deleteOne();

  if (!response) {
    return next(new HttpError("Question not found.", 404));
  }

  res.status(200).json({ message: "Question deleted successfully." });
};

exports.addQuestion = addQuestion;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionById = getQuestionById;
exports.deleteQuestion = deleteQuestion;
exports.updateQuestion = updateQuestion;
