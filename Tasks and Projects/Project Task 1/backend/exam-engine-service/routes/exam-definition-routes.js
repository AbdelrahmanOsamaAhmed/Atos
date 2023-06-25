const { Router } = require("express");
const ExamDefinitionController = require("../controllers/exam-definition-controllers");
const router = Router();

router.get(
  "/check-assigned-exams/:id",
  ExamDefinitionController.checkAssignedExams
);
router.post("/stop-consumer/:id", ExamDefinitionController.stopConsumer);
router.get("/instances", ExamDefinitionController.getArrayOfExamInstancesById);
router.get("/:id", ExamDefinitionController.getExamDefinitionById);
router.post("/instance", ExamDefinitionController.CreateExamInstance);
router.get("/instance/:id", ExamDefinitionController.getExamInstanceById);
router.get("/", ExamDefinitionController.getAllExamsDefinitions);
router.post("/", ExamDefinitionController.createExamDefinition);
router.delete("/", ExamDefinitionController.deleteExamDefinitionById);
router.post("/update-start-time/:id", ExamDefinitionController.updateStartTime);
router.post("/grade-exam/:id", ExamDefinitionController.gradeExamInstance);

module.exports = router;
