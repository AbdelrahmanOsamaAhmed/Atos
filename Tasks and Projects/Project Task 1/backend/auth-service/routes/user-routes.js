const { Router } = require("express");
const usersControllers = require("../controllers/users-controllers");
const router = Router();

router.get('/',usersControllers.getAllUsers)
router.post("/login", usersControllers.login);
router.post("/signup", usersControllers.signup);

module.exports = router;
