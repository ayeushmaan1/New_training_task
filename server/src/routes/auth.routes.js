import { Router } from 'express';
import {
  forgotPassword,
  getBookmarks,
  getRecentlyRead,
  loginAdmin,
  loginUser,
  logout,
  me,
  resetPassword,
  signup,
  updateProfile,
  uploadAvatar
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  forgotPasswordSchema,
  loginSchema,
  profileSchema,
  resetPasswordSchema,
  signupSchema
} from '../validators/schemas.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), loginUser);
router.post('/admin/login', validate(loginSchema), loginAdmin);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, me);
router.patch('/me', authenticate, validate(profileSchema), updateProfile);
router.post('/me/avatar', authenticate, uploadImage.single('image'), uploadAvatar);
router.get('/me/bookmarks', authenticate, getBookmarks);
router.get('/me/recently-read', authenticate, getRecentlyRead);
router.post('/logout', authenticate, logout);

export default router;
