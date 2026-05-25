import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { getUserById } from '../data/store.js';

async function readUserFromHeader(req) {
  const header = req.headers.authorization || '';
  const [, token] = header.match(/^Bearer\s+(.+)$/i) || [];

  if (!token) {
    return null;
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-change-me');
  const user = await getUserById(payload.sub);

  if (!user) {
    throw new ApiError(401, 'Session is no longer valid');
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'This account has been blocked');
  }

  return user;
}

export async function authenticate(req, _res, next) {
  try {
    const user = await readUserFromHeader(req);
    if (!user) {
      throw new ApiError(401, 'Authentication required');
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Invalid or expired session'));
      return;
    }
    next(error);
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    req.user = await readUserFromHeader(req);
    next();
  } catch {
    req.user = null;
    next();
  }
}

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    next(new ApiError(403, 'You do not have permission to perform this action'));
    return;
  }
  next();
};
