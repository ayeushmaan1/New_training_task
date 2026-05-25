# Inkline Blog Platform

A modern full-stack blog application with separate user and admin authentication, animated React UI, secure Express APIs, content moderation, image uploads, and analytics.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios
- Backend: Node.js, Express, JWT, bcrypt, Zod, Helmet, CORS, rate limiting, Multer, Nodemailer
- Data: MongoDB with Mongoose when `MONGO_URI` is provided, with a local JSON-backed development store when it is not

## Features

- User signup, login, persistent JWT sessions, forgot/reset password flow, profile editing, avatar upload
- Admin login, RBAC-protected admin console, users, blogs, comments, categories, analytics
- Blog search, category filtering, sorting by latest, most viewed, most liked, and trending
- Likes, bookmarks, recently read blogs, comments, own-comment deletion
- Markdown editor with preview, draft/publish states, cover upload, tags, SEO fields, slug generation, reading time
- Contact form with Nodemailer integration
- Responsive UI, dark mode, page transitions, staggered cards, modal-style feedback, accessible semantic structure

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Client: `http://localhost:5173`

API: `http://localhost:5000/api`

Demo accounts:

- User: `user@example.com` / `Password123!`
- Admin: `admin@example.com` / `Admin123!`

## Environment

Copy `.env.example` to `.env` and update values for your environment.

Important variables:

- `JWT_SECRET`: use a long random secret in production
- `CLIENT_URL`: allowed frontend origin for CORS
- `VITE_API_URL`: frontend API base URL
- `MONGO_URI`: optional MongoDB connection string
- `SMTP_*`: optional email settings for contact and password reset mail
- `PUBLIC_MEDIA_URL`: optional CDN/media base URL

## Scripts

```bash
npm run dev          # run API and Vite together
npm run dev:server   # run Express API only
npm run dev:client   # run Vite client only
npm run build        # production frontend build
npm start            # run Express API
npm run seed         # reset demo data
npm run lint         # lint client and server code
```

## API Overview

Public:

- `GET /api/blogs`
- `GET /api/blogs/featured`
- `GET /api/blogs/trending`
- `GET /api/blogs/categories`
- `GET /api/blogs/:slug`
- `POST /api/contact`

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `POST /api/auth/me/avatar`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

User:

- `POST /api/blogs/:id/like`
- `POST /api/blogs/:id/bookmark`
- `GET /api/auth/me/bookmarks`
- `GET /api/auth/me/recently-read`
- `POST /api/blogs/:id/comments`
- `PATCH /api/blogs/comments/:commentId`
- `DELETE /api/blogs/comments/:commentId`

Admin:

- `GET /api/admin/dashboard`
- `GET /api/admin/analytics`
- `GET /api/admin/blogs`
- `POST /api/blogs`
- `PATCH /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/comments`
- `PATCH /api/admin/comments/:id/moderate`
- `DELETE /api/admin/comments/:id`
- `POST /api/admin/categories`

## Production Notes

- Set `NODE_ENV=production`
- Provide `MONGO_URI`; the JSON store is intended for local development and demos
- Use a strong `JWT_SECRET`
- Put the API behind HTTPS
- Store uploads in Cloudinary, S3, or a CDN-backed volume for durable media
- Configure SMTP for password reset and contact emails
- Review CORS origins before deployment
- Serve `dist` from a static host or reverse proxy the API and client behind the same domain

## Folder Structure

```text
client/src/
  components/
  context/
  pages/
  services/
server/src/
  config/
  controllers/
  data/
  middleware/
  models/
  routes/
  utils/
  validators/
```
