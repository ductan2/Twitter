import express from "express"
import { loginController, registerController } from "~/controllers/users.controller";
import { AccountValidator, RegisterValidator } from "~/middlewares/users.middlewares";
import { validate } from "~/utils/validator";

const router = express.Router();


router.get("/", (req, res, next) => {
  res.send("Hello user");
})
router.post("/login", AccountValidator, loginController)

router.post('/register', validate(RegisterValidator), registerController)
export default router;