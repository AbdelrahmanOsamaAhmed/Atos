const express = require("express");
const cors = require("cors");
const { sequelize, ExamDefinition } = require("./models");
const ExamDefinitionRouter = require("./routes/exam-definition-routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/exam-definition", ExamDefinitionRouter);

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
app.post("/", async (req, res, next) => {
  const { name, passingScore } = req.body;
  const createdExam = await ExamDefinition.create({
    exam_name: name,
    passing_score: passingScore,
  });
  res.json(createdExam);
});

app.listen(5002, async () => {
  await sequelize.sync(/* { force: true } */);
  console.log("listening on port 5002");
});
