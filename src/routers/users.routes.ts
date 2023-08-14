import express, { RequestHandler } from "express"
import { emailVerifyValidator, forgotPasswordController, getInfoController, loginController, logoutController, registerController, resendVerifyEmailController, resetPasswordController, verifyForgotPasswordController } from "~/controllers/users.controller";
import { AccessTokenValidator, EmailVerifyTokenValidator, LoginValidator, RefreshTokenValidator, RegisterValidator, forgotpasswordValidator, resetPasswordValidator, verifyForgotPasswordValidator } from "~/middlewares/users.middlewares";
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


export default router;