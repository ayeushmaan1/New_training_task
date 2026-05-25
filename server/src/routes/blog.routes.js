import { Router } from 'express';
import {
  bookmarkBlog,
  createBlogComment,
  createBlogPost,
  deleteBlogPost,
  editComment,
  getBlog,
  getBlogComments,
  getBlogs,
  getCategories,
  getFeaturedBlogs,
  getTrendingBlogs,
  likeBlog,
  removeComment,
  updateBlogPost
} from '../controllers/blog.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { blogSchema, blogUpdateSchema, commentSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', optionalAuth, getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/categories', getCategories);
router.post('/', authenticate, authorize('admin'), validate(blogSchema), createBlogPost);
router.patch('/:id', authenticate, authorize('admin'), validate(blogUpdateSchema), updateBlogPost);
router.delete('/:id', authenticate, authorize('admin'), deleteBlogPost);
router.post('/:id/like', authenticate, likeBlog);
router.post('/:id/bookmark', authenticate, bookmarkBlog);
router.get('/:id/comments', getBlogComments);
router.post('/:id/comments', authenticate, validate(commentSchema), createBlogComment);
router.patch('/comments/:commentId', authenticate, validate(commentSchema), editComment);
router.delete('/comments/:commentId', authenticate, removeComment);
router.get('/:slug', optionalAuth, getBlog);

export default router;
