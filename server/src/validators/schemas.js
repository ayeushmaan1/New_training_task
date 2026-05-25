import { z } from 'zod';
import { normalizeTags } from '../utils/text.js';

export const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(120)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(120)
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url().or(z.literal('')).optional()
});

export const blogSchema = z.object({
  title: z.string().min(4).max(160),
  excerpt: z.string().min(20).max(320),
  content: z.string().min(40),
  coverImage: z.string().optional().default(''),
  category: z.string().min(2).max(80),
  tags: z.preprocess((value) => normalizeTags(value || []), z.array(z.string()).max(12)),
  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().max(160).optional().default(''),
  seoDescription: z.string().max(220).optional().default('')
});

export const blogUpdateSchema = blogSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required'
});

export const commentSchema = z.object({
  body: z.string().min(2).max(1000)
});

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#20a58a')
});

export const moderationSchema = z.object({
  status: z.enum(['approved', 'hidden', 'flagged'])
});

export const userModerationSchema = z.object({
  isBlocked: z.boolean().optional(),
  role: z.enum(['user', 'admin']).optional()
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(4).max(120),
  message: z.string().min(20).max(1500)
});
