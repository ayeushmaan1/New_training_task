import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sanitizeMarkdown } from '../utils/text.js';
import {
  addRecentlyRead,
  createBlog,
  createComment,
  deleteBlog,
  deleteComment,
  getBlogById,
  getBlogBySlug,
  getCommentById,
  incrementBlogView,
  listBlogs,
  listCategories,
  listComments,
  toggleBlogLike,
  toggleBookmark,
  updateBlog,
  updateComment
} from '../data/store.js';

function canEditComment(user, comment) {
  return user.role === 'admin' || comment.userId === user.id;
}

export const getBlogs = asyncHandler(async (req, res) => {
  const result = await listBlogs({
    search: req.query.search,
    category: req.query.category,
    tag: req.query.tag,
    sort: req.query.sort,
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status,
    includeDrafts: req.user?.role === 'admin' && req.query.includeDrafts === 'true'
  });

  res.json({
    success: true,
    data: result
  });
});

export const getFeaturedBlogs = asyncHandler(async (_req, res) => {
  const result = await listBlogs({ sort: 'most-liked', limit: 3 });
  res.json({
    success: true,
    data: result
  });
});

export const getTrendingBlogs = asyncHandler(async (_req, res) => {
  const result = await listBlogs({ sort: 'trending', limit: 6 });
  res.json({
    success: true,
    data: result
  });
});

export const getCategories = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      categories: await listCategories()
    }
  });
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await getBlogBySlug(req.params.slug);

  if (!blog || (blog.status !== 'published' && req.user?.role !== 'admin')) {
    throw new ApiError(404, 'Blog not found');
  }

  await incrementBlogView(blog.id);
  if (req.user) {
    await addRecentlyRead(req.user.id, blog.id);
  }

  res.json({
    success: true,
    data: {
      blog: {
        ...blog,
        views: blog.views + 1
      }
    }
  });
});

export const createBlogPost = asyncHandler(async (req, res) => {
  const blog = await createBlog(
    {
      ...req.body,
      content: sanitizeMarkdown(req.body.content)
    },
    req.user.id
  );

  res.status(201).json({
    success: true,
    data: {
      blog
    }
  });
});

export const updateBlogPost = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.content) {
    payload.content = sanitizeMarkdown(payload.content);
  }

  const blog = await updateBlog(req.params.id, payload, req.user.id);
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

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const deleted = await deleteBlog(req.params.id, req.user.id);
  if (!deleted) {
    throw new ApiError(404, 'Blog not found');
  }

  res.json({
    success: true,
    message: 'Blog deleted'
  });
});

export const likeBlog = asyncHandler(async (req, res) => {
  const result = await toggleBlogLike(req.params.id, req.user.id);
  if (!result) {
    throw new ApiError(404, 'Blog not found');
  }

  res.json({
    success: true,
    data: result
  });
});

export const bookmarkBlog = asyncHandler(async (req, res) => {
  const result = await toggleBookmark(req.user.id, req.params.id);
  if (!result) {
    throw new ApiError(404, 'Blog not found');
  }

  res.json({
    success: true,
    data: result
  });
});

export const getBlogComments = asyncHandler(async (req, res) => {
  const blog = await getBlogById(req.params.id);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  res.json({
    success: true,
    data: {
      comments: await listComments({ blogId: req.params.id })
    }
  });
});

export const createBlogComment = asyncHandler(async (req, res) => {
  const comment = await createComment(req.params.id, req.user.id, req.body.body);
  if (!comment) {
    throw new ApiError(404, 'Blog not found');
  }

  res.status(201).json({
    success: true,
    data: {
      comment
    }
  });
});

export const editComment = asyncHandler(async (req, res) => {
  const comment = await getCommentById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (!canEditComment(req.user, comment)) {
    throw new ApiError(403, 'You can only edit your own comments');
  }

  res.json({
    success: true,
    data: {
      comment: await updateComment(req.params.commentId, req.body.body)
    }
  });
});

export const removeComment = asyncHandler(async (req, res) => {
  const comment = await getCommentById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (!canEditComment(req.user, comment)) {
    throw new ApiError(403, 'You can only delete your own comments');
  }

  await deleteComment(req.params.commentId);
  res.json({
    success: true,
    message: 'Comment deleted'
  });
});
