const { Router } = require("express");
const questionsControllers = require("../controllers/questions.controllers");

const router = Router();

router.post("/add-question", questionsControllers.addQuestion);
router.get("/", questionsControllers.getAllQuestions);
router.get("/:id", questionsControllers.getQuestionById);
router.patch("/update-question", questionsControllers.updateQuestion);
router.delete("/:id", questionsControllers.deleteQuestion);

module.exports = router;
