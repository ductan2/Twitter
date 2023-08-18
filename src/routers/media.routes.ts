import express from 'express';
import { uploadImageController } from '~/controllers/medias.controller';

const router = express.Router();



router.post('/upload-image', uploadImageController);


export default router;