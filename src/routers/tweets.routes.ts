import { Router } from "express";
import { createTweetController } from "~/controllers/tweets.controller";
import { createTweetValidator } from "~/middlewares/tweet.middlewares";
import { AccessTokenValidator, verifiedUserValidator } from "~/middlewares/users.middlewares";
import { validate } from "~/utils/validator";
const router = Router();


router.post("/", validate(AccessTokenValidator), verifiedUserValidator, validate(createTweetValidator),createTweetController)


export default router;