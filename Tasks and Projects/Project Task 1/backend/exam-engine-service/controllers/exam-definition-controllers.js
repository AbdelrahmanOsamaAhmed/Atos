const { ExamDefinition, Question, ExamInstance } = require("../models");
const axios = require("axios");
const KafkaConfig = require("../config.js");
const mongoose = require("mongoose");
const io = require("socket.io")(3001, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => console.log('Connected'));
const kafkaConfig = new KafkaConfig();
const kafkaHandler = async (studentId) => {
  try {
    const kafkaConfig = new KafkaConfig();
    const messages = [{ key: "key1", value: "Kafka Working" }];
    kafkaConfig.produce(studentId, messages);
  } catch (error) {
    console.log(error);
  }
};

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

const getAllExamsDefinitions = async (req, res, next) => {
  const exams = await ExamDefinition.findAll({
    include: {
      model: Question,
      as: "questions",
      attributes: ["question_id"],
    },
  });
  res.json(exams);
};
const getExamDefinitionById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const fetchedExam = await ExamDefinition.findByPk(id, {
      include: {
        model: Question,
        as: "questions",
        attributes: ["question_id"],
      },
    });
    res.json(fetchedExam);
  } catch (error) {
    res.json(error);
  }
};
const createExamDefinition = async (req, res, next) => {
  const { examName, passingScore, examQuestions } = req.body.exam;
  const token = req.headers.authorization.split(" ")[1];
  const { userId, userType } = await tokenVerifier(token);
  if (userType !== "TEACHER") {
    return next(new Error("INVALID USER TYPE"));
  }
  const createdExam = await ExamDefinition.create({
    exam_name: examName,
    passing_score: passingScore,
    created_by: userId,
  });
  await Promise.all(
    examQuestions.map(async (question) => {
      const createdQuestion = await Question.create({
        question_id: question._id,
        exam_id: createdExam.id,
      });
      return createdQuestion;
    })
  );
  res.json(createdExam);
};

const deleteExamDefinitionById = async (req, res, next) => {
  await ExamDefinition.destroy({
    where: {
      id: 4,
    },
  });
  res.json({ message: "DELETED" });
};

const CreateExamInstance = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const { userId, userType } = await tokenVerifier(token);
  if (userType !== "TEACHER") {
    return next(new Error("INVALID USER TYPE"));
  }
  const { id } = req.body.exam;
  const { studentId, startTime, endTime } = req.body;

  const createdInstance = await ExamInstance.create({
    exam_definition_id: id,
    createdBy: userId,
    schduledtimeFrom: startTime,
    schduledtimeTo: endTime,
    takenBy: studentId,
  });
  await kafkaHandler(new mongoose.Types.ObjectId(studentId).toString());
  res.json({ createdInstanceId: createdInstance.id });
};

const getArrayOfExamInstancesById = async (req, res, next) => {
  const { userId: takenBy } = req.query;
  try {
    const fetchedExamInstance = await ExamInstance.findAll({
      where: {
        takenBy,
      },
      include: [
        {
          model: ExamDefinition,
          as: "exam_definition",
          include: [
            {
              model: Question,
              as: "questions",
            },
          ],
        },
      ],
    });
    res.json(fetchedExamInstance);
  } catch (error) {
    res.json(error);
  }
};

const getExamInstanceById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const fetchedExamInstance = await ExamInstance.findOne({
      where: {
        id,
      },
      include: [
        {
          model: ExamDefinition,
          as: "exam_definition",
          include: [
            {
              model: Question,
              as: "questions",
            },
          ],
        },
      ],
    });

    res.json(fetchedExamInstance);
  } catch (error) {
    res.json(error);
  }
};

exports.updateStartTime = async (req, res, next) => {
  try {
    const id = req.params.id;
    const examInstance = await ExamInstance.update(
      {
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60000),
        status: "taken",
      },
      { where: { id } }
    );
    res.status(200).json({ message: "Started the exam" });
  } catch (error) {
    res.json(error);
  }
};
const gradeQuestion = (question) => {
  const selectedAnswers = question.selectedAnswers;
  const correctAnswers = question.correctAnswers.map((answer) => answer._id);
  const isCorrect = selectedAnswers.every((answer) =>
    correctAnswers.includes(answer)
  );

  if (isCorrect) {
    return question.mark;
  } else {
    return 0;
  }
};
exports.gradeExamInstance = async (req, res, next) => {
  const { examInstance } = req.body;
  let totalScore = 0;
  let studentScore = 0;
  for (selectedAnswer of examInstance.selectedAnswers) {
    studentScore += gradeQuestion(selectedAnswer);
    totalScore += selectedAnswer.mark;
  }
  const obtainedScore = ((studentScore / totalScore) * 100).toFixed(2);
  await ExamInstance.update(
    {
      endTime: new Date(),
      status: "taken",
      score: obtainedScore,
    },
    { where: { id: examInstance.exam_instance_id } }
  );

  res.json("OK");
};

exports.checkAssignedExams = async (req, res, next) => {
  const { id } = req.params;
  kafkaConfig.consume(id, (value) => {
    io.emit(
      id,
      "An exam has been assigned to you, go to your profile to see more details"
    );
  });
  res.status(200).json("Successfully Connected");
};
exports.getAllExamsDefinitions = getAllExamsDefinitions;
exports.createExamDefinition = createExamDefinition;
exports.deleteExamDefinitionById = deleteExamDefinitionById;
exports.getExamDefinitionById = getExamDefinitionById;
exports.CreateExamInstance = CreateExamInstance;
exports.getExamInstanceById = getExamInstanceById;
exports.getArrayOfExamInstancesById = getArrayOfExamInstancesById;
