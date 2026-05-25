import { Router } from 'express';
import { uploadImageFile } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = Router();

router.post('/image', authenticate, uploadImage.single('image'), uploadImageFile);

export default router;
