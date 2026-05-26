import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {
  createCategory,
  deleteCategory,
  deleteComment,
  deleteUser,
  getAnalytics,
  getBlogById,
  listBlogs,
  listCategories,
  listComments,
  listUsers,
  moderateComment,
  toPublicUser,
  updateCategory,
  updateUser
} from '../data/store.js';

export const dashboard = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: await getAnalytics()
  });
});

export const analytics = dashboard;

export const adminBlogs = asyncHandler(async (req, res) => {
  const result = await listBlogs({
    includeDrafts: true,
    status: req.query.status,
    search: req.query.search,
    sort: req.query.sort,
    page: req.query.page,
    limit: req.query.limit
  });

  res.json({
    success: true,
    data: result
  });
});

export const adminBlog = asyncHandler(async (req, res) => {
  const blog = await getBlogById(req.params.id);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  res.json({
    success: true,
    data: {
      blog
    }
  });
});

export const users = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      users: await listUsers({ search: req.query.search })
    }
  });
});

export const moderateUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id && req.body.isBlocked) {
    throw new ApiError(400, 'You cannot block your own admin account');
  }

  const updated = await updateUser(req.params.id, req.body);
  if (!updated) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: {
      user: toPublicUser(updated)
    }
  });
});

export const removeUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, 'You cannot delete your own admin account');
  }

  await deleteUser(req.params.id);
  res.json({
    success: true,
    message: 'User removed'
  });
});

export const comments = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      comments: await listComments({ includeHidden: true })
    }
  });
});

export const moderateCommentStatus = asyncHandler(async (req, res) => {
  const comment = await moderateComment(req.params.id, req.body.status);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  res.json({
    success: true,
    data: {
      comment
    }
  });
});

export const removeComment = asyncHandler(async (req, res) => {
  const deleted = await deleteComment(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Comment not found');
  }

  res.json({
    success: true,
    message: 'Comment removed'
  });
});

export const categories = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      categories: await listCategories()
    }
  });
});

export const addCategory = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      category: await createCategory(req.body)
    }
  });
});

export const editCategory = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.json({
    success: true,
    data: {
      category
    }
  });
});

export const removeCategory = asyncHandler(async (req, res) => {
  const deleted = await deleteCategory(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Category not found');
  }

  res.json({
    success: true,
    message: 'Category removed'
  });
});
