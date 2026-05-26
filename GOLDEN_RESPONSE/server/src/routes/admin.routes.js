import { Router } from 'express';
import {
  addCategory,
  adminBlog,
  adminBlogs,
  analytics,
  categories,
  comments,
  dashboard,
  editCategory,
  moderateCommentStatus,
  moderateUser,
  removeCategory,
  removeComment,
  removeUser,
  users
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { categorySchema, moderationSchema, userModerationSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', dashboard);
router.get('/analytics', analytics);
router.get('/blogs', adminBlogs);
router.get('/blogs/:id', adminBlog);
router.get('/users', users);
router.patch('/users/:id', validate(userModerationSchema), moderateUser);
router.delete('/users/:id', removeUser);
router.get('/comments', comments);
router.patch('/comments/:id/moderate', validate(moderationSchema), moderateCommentStatus);
router.delete('/comments/:id', removeComment);
router.get('/categories', categories);
router.post('/categories', validate(categorySchema), addCategory);
router.patch('/categories/:id', validate(categorySchema.partial()), editCategory);
router.delete('/categories/:id', removeCategory);

export default router;
