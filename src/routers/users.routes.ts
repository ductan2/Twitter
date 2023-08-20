import express from "express"
import { changePasswordController, emailVerifyValidator, followController, forgotPasswordController, getInfoController, loginController, logoutController, oauthGoogleController, refreshTokenController, registerController, resendVerifyEmailController, resetPasswordController, unFollowController, updateInfoController, verifyForgotPasswordController } from "~/controllers/users.controller";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { AccessTokenValidator, EmailVerifyTokenValidator, LoginValidator, RefreshTokenValidator, RegisterValidator, changePasswordvalidator, followValidator, forgotpasswordValidator, resetPasswordValidator, updateInfoValidator, verifiedUserValidator, verifyForgotPasswordValidator } from "~/middlewares/users.middlewares";
import { UpdateInfo } from "~/models/schemas/users.schemas";
import { validate } from "~/utils/validator";

const router = express.Router();


router.get("/", (req, res, next) => {
  res.send("Hello user");
})
router.post("/login", validate(LoginValidator), loginController)

router.post('/register', validate(RegisterValidator), registerController)

router.post("/logout", validate(AccessTokenValidator), validate(RefreshTokenValidator), logoutController)

router.post("/refresh-token", validate(RefreshTokenValidator), refreshTokenController)

router.post("/verify-email", validate(EmailVerifyTokenValidator), emailVerifyValidator)

router.post("/resend-email-verify", validate(AccessTokenValidator), resendVerifyEmailController as any)

router.post("/forgot-password", validate(forgotpasswordValidator), forgotPasswordController)

router.post('/verify-forgot-password', validate(verifyForgotPasswordValidator), verifyForgotPasswordController)

router.post('/reset-password', validate(resetPasswordValidator), resetPasswordController)

router.put('/change-password', validate(AccessTokenValidator), verifiedUserValidator, validate(changePasswordvalidator), changePasswordController)

router.get('/get-info', validate(AccessTokenValidator), getInfoController)

router.patch('/get-info', validate(AccessTokenValidator), verifiedUserValidator, validate(updateInfoValidator),
  filterMiddleware<UpdateInfo>(["avatar", "bio", "cover_photo", "date_of_birth", "location", "name", "username", "website"]),
  updateInfoController)

router.post("/follow", validate(AccessTokenValidator), verifiedUserValidator, validate(followValidator), followController)

router.delete("/follow/:user_id", validate(AccessTokenValidator), verifiedUserValidator, unFollowController)

router.get('/oauth/google', oauthGoogleController)

export default router;