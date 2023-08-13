import express from "express"
import { loginController, logoutController, registerController } from "~/controllers/users.controller";
import { AccessTokenValidator, LoginValidator, RefreshTokenValidator, RegisterValidator } from "~/middlewares/users.middlewares";
import { validate } from "~/utils/validator";

const router = express.Router();


router.get("/", (req, res, next) => {
  res.send("Hello user");
})
router.post("/login", validate(LoginValidator), loginController)

router.post('/register', validate(RegisterValidator), registerController)

router.post("/logout", validate(AccessTokenValidator), validate(RefreshTokenValidator), logoutController)
export default router;