import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { createOpaqueToken, hashToken, signAccessToken } from '../utils/tokens.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';
import {
  createUser,
  findUserByEmail,
  findUserByResetTokenHash,
  getBookmarkedBlogs,
  getRecentlyReadBlogs,
  toPublicUser,
  updateUser
} from '../data/store.js';

function authPayload(user) {
  return {
    user: toPublicUser(user),
    token: signAccessToken(user)
  };
}

async function login(req, res, requiredRole = 'user') {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'This account has been blocked');
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }

  res.json({
    success: true,
    data: authPayload(user)
  });
}

export const signup = asyncHandler(async (req, res) => {
  const existing = await findUserByEmail(req.body.email);
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await createUser({
    name: req.body.name,
    email: req.body.email,
    passwordHash
  });

  res.status(201).json({
    success: true,
    data: authPayload(user)
  });
});

export const loginUser = asyncHandler((req, res) => login(req, res, 'user'));
export const loginAdmin = asyncHandler((req, res) => login(req, res, 'admin'));

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: toPublicUser(req.user)
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await updateUser(req.user.id, req.body);
  res.json({
    success: true,
    data: {
      user: toPublicUser(updated)
    }
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  const updated = await updateUser(req.user.id, { avatarUrl });

  res.json({
    success: true,
    data: {
      avatarUrl,
      user: toPublicUser(updated)
    }
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.body.email);

  if (user) {
    const reset = createOpaqueToken();
    await updateUser(user.id, {
      resetTokenHash: reset.hash,
      resetTokenExpires: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    });
    await sendPasswordResetEmail(user, reset.token);
  }

  res.json({
    success: true,
    message: 'If an account exists, a reset link has been sent'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await findUserByResetTokenHash(hashToken(req.body.token));

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or expired');
  }

  await updateUser(user.id, {
    passwordHash: await bcrypt.hash(req.body.password, 12),
    resetTokenHash: null,
    resetTokenExpires: null
  });

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

export const getBookmarks = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      blogs: await getBookmarkedBlogs(req.user.id)
    }
  });
});

export const getRecentlyRead = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      blogs: await getRecentlyReadBlogs(req.user.id)
    }
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    message: 'Logged out'
  });
});
