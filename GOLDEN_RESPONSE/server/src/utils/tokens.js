import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET || 'development-secret-change-me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function createOpaqueToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
