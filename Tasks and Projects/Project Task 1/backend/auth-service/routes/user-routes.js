const { Router } = require("express");
const usersControllers = require("../controllers/users-controllers");
const Auth = require("../middleware/auth");

const router = Router();

router.post("/login", usersControllers.login);
router.post("/signup", usersControllers.signup);
router.post("/keycloak",usersControllers.addKeyCloakUserNameToDataBase)
router.use(Auth);
router.get("/students", usersControllers.getAllStudents);
router.get("/token-verifier", usersControllers.tokenVerifier);
router.get("/:id", usersControllers.getUserById);
router.get("/user-by-name/:name", usersControllers.getUserByUserName);
router.get("/", usersControllers.getAllUsers);
router.post("/create-admin", usersControllers.createAdmin);
router.post("/assign-instance", usersControllers.assignExamInstanceToStudent);
module.exports = router;
