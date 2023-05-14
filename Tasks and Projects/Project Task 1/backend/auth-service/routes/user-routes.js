const { Router } = require("express");
const usersControllers = require("../controllers/users-controllers");
const Auth = require("../middleware/auth");

const router = Router();

router.post("/login", usersControllers.login);
router.post("/signup", usersControllers.signup);
router.use(Auth);
router.get("/token-verifier", usersControllers.tokenVerifier);
router.get("/:id", usersControllers.getUserById);
router.get("/", usersControllers.getAllUsers);
router.post("/create-admin", usersControllers.createAdmin);
module.exports = router;
