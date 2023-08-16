import express, { RequestHandler } from "express"
import { emailVerifyValidator, forgotPasswordController, getInfoController, loginController, logoutController, registerController, resendVerifyEmailController, resetPasswordController, updateInfoController, verifyForgotPasswordController } from "~/controllers/users.controller";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { AccessTokenValidator, EmailVerifyTokenValidator, LoginValidator, RefreshTokenValidator, RegisterValidator, forgotpasswordValidator, resetPasswordValidator, updateInfoValidator, verifiedUserValidator, verifyForgotPasswordValidator } from "~/middlewares/users.middlewares";
import { UpdateInfo } from "~/models/schemas/users.schemas";
import { validate } from "~/utils/validator";

const router = express.Router();


router.get("/", (req, res, next) => {
  res.send("Hello user");
})
router.post("/login", validate(LoginValidator), loginController)

router.post('/register', validate(RegisterValidator), registerController)

router.post("/logout", validate(AccessTokenValidator), validate(RefreshTokenValidator), logoutController)

router.post("/verify-email", validate(EmailVerifyTokenValidator), emailVerifyValidator)

router.post("/resend-email-verify", validate(AccessTokenValidator), resendVerifyEmailController as any)

router.post("/forgot-password", validate(forgotpasswordValidator), forgotPasswordController)

router.post('/verify-forgot-password', validate(verifyForgotPasswordValidator), verifyForgotPasswordController)

router.post('/reset-password', validate(resetPasswordValidator), resetPasswordController)

router.get('/get-info', validate(AccessTokenValidator), getInfoController)

router.patch('/get-info', validate(AccessTokenValidator), verifiedUserValidator as any, validate(updateInfoValidator),
  filterMiddleware<UpdateInfo>(["avatar", "bio", "cover_photo", "date_of_birth", "location", "name", "username", "website"]),
  updateInfoController)

export default router;