import express from 'express';
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controller';
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares';
import { validate } from '~/utils/validator';

const router = express.Router();



router.post('/upload-image', validate(AccessTokenValidator), verifiedUserValidator, uploadImageController);
router.post('/upload-video', validate(AccessTokenValidator), verifiedUserValidator, uploadVideoController);

export default router;