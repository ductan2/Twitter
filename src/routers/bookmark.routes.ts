import { Router } from "express";
import { createBookMarkController } from "~/controllers/bookmark.controller";
import { AccessTokenValidator, verifiedUserValidator } from "~/middlewares/users.middlewares";
import { validate } from "~/utils/validator";

const router = Router();

router.post("/", validate(AccessTokenValidator), verifiedUserValidator, createBookMarkController);


export default router;
