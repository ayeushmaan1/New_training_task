# Blog Application – Full Stack Development Prompt

## Context and Role
As a full-stack developer, your task is to design and develop a modern full-featured Blog Application with separate User and Admin authentication systems. The application should provide a smooth, responsive, and visually engaging experience while maintaining strong security, scalability, accessibility, and performance standards.

The blog platform should support content creation, publishing, editing, user engagement, and administrative moderation through a clean and professional UI with modern animations and interactive elements.

---

# Objective

Develop a complete Blog Application that:

- Uses a modern frontend architecture with responsive UI
- Supports separate User and Admin authentication systems
- Allows users to read, search, comment, like, and bookmark blogs
- Allows admins to manage users, blogs, comments, and analytics
- Implements secure backend APIs with authentication and authorization
- Includes modern animations and transitions using Framer Motion
- Provides scalable and maintainable folder structure
- Supports production-level deployment and performance optimization

---

# Application Features

## Authentication System

Implement secure authentication and authorization for:

- User Login and Signup
- Admin Login
- JWT or Session-based Authentication
- Protected Routes
- Role-Based Access Control (RBAC)

### Authentication Features Should Include

- Signup with validation
- Secure password hashing using bcrypt
- Forgot Password and Reset Password functionality
- Email verification (optional)
- Persistent login sessions
- Logout functionality
- Google OAuth login (optional)

---

# User Features

Users should be able to:

- Create an account and login securely
- View all blogs
- Search blogs by title, category, or tags
- Filter blogs by category
- Read full blog posts
- Like and bookmark blogs
- Comment on blog posts
- Edit or delete their own comments
- Manage their profile
- Upload profile image
- View saved/bookmarked blogs
- View recently read blogs

---

# Admin Features

Admin panel should allow:

- Admin login authentication
- Dashboard with analytics overview
- Create, edit, publish, and delete blogs
- Manage blog categories and tags
- Upload blog cover images
- Moderate comments
- Delete inappropriate comments
- Manage users
- Block or remove users

### Platform Statistics

- Total users
- Total blogs
- Most viewed blogs
- Recent activity
- Comment analytics

---

# Blog Editor Requirements

Implement a rich blog writing experience including:

- Rich text editor or Markdown editor
- Image upload support
- Blog preview before publishing
- Draft saving functionality
- Tag and category support
- SEO-friendly slug generation
- Estimated reading time calculation
- Syntax highlighting for code blocks (optional)

---

# UI and Animation Requirements

## Modern UI Design

The application should have:

- Clean modern UI
- Responsive layouts for mobile, tablet, and desktop
- Minimal and professional design
- Accessible semantic HTML structure
- Dark mode support (optional)

---

## Animations

Use Framer Motion for:

- Page transitions
- Fade-in animations
- Staggered blog card animations
- Modal animations
- Hover effects
- Scroll-based reveal animations
- Interactive dashboard animations

### Animation Guidelines

Animations should:

- Feel smooth and modern
- Use optimized properties like transform and opacity
- Avoid performance-heavy animations
- Work smoothly across devices

---

# Pages and Layout Requirements

## Public Pages

- Home Page
- Featured Blogs Section
- Trending Blogs
- Categories Section
- Blog Detail Page
- About Page
- Contact Page

---

## User Pages

- Login Page
- Signup Page
- Profile Dashboard
- Bookmarks Page
- User Settings Page

---

## Admin Pages

- Admin Dashboard
- Manage Blogs Page
- Create/Edit Blog Page
- Manage Users Page
- Manage Comments Page
- Analytics Page

---

# Backend Requirements

## API Development

Create secure REST APIs or Next.js API routes for:

- Authentication
- Blog CRUD operations
- Comments management
- Likes and bookmarks
- User profile management
- Admin moderation features

---

## Security Requirements

Secure all APIs using:

- JWT authentication
- Role-based middleware
- Input sanitization
- Rate limiting
- Helmet security middleware
- CORS protection
- XSS prevention
- CSRF protection (if required)

---

## Validation

Validate and sanitize all incoming data.

### Prevent

- XSS attacks
- Injection attacks
- Invalid file uploads
- Unauthorized API access

---

# Database Requirements

Use MongoDB or PostgreSQL.

### Database Should Support

- Users collection/table
- Blogs collection/table
- Comments collection/table
- Bookmarks collection/table
- Categories collection/table
- Analytics data

### Optional Features

- Redis caching
- Search indexing
- Cloudinary or AWS S3 image storage

---

# File Upload System

Implement secure image upload handling for:

- Profile pictures
- Blog cover images
- Inline blog images

### Features Should Include

- File size validation
- Supported format validation
- Secure storage handling
- Optimized image delivery

---

# Search and Filtering

Implement advanced search functionality including:

- Keyword search
- Tag filtering
- Category filtering

### Sorting Options

- Latest
- Most viewed
- Most liked
- Trending

---

# Contact System

Create a contact form that:

- Allows visitors to contact the platform owner
- Uses animated modal or dedicated page
- Sends email notifications using Nodemailer
- Validates all inputs properly
- Returns structured success/error responses

---

# Performance Optimization

Optimize the application by:

- Using lazy loading
- Code splitting
- Image optimization
- Caching strategies
- Pagination or infinite scrolling
- Reducing unnecessary re-renders
- Optimizing API calls
- Using lightweight animations

---

# Scalability and Maintainability

Ensure the project:

- Uses reusable components
- Follows clean architecture
- Separates frontend and backend concerns properly
- Uses environment variables securely
- Supports future scalability

---

# Technology Stack

## Frontend

- React.js or Next.js
- Tailwind CSS
- Framer Motion
- Redux Toolkit or Context API
- Axios

---

## Backend

- Node.js
- Express.js or Next.js API Routes
- JWT Authentication
- bcrypt
- Nodemailer
- dotenv

---

## Database

- MongoDB with Mongoose

### OR

- PostgreSQL with Prisma

---

# Optional Integrations

- Cloudinary or AWS S3
- Redis
- Google OAuth
- Markdown Editor
- React Query or TanStack Query

---

# Folder Structure Requirements

Maintain a scalable folder structure including:

- components
- pages or app router
- layouts
- hooks
- services
- context/store
- middleware
- utils
- api
- models
- controllers
- routes

---

# Error Handling and Logging

Handle errors properly on both frontend and backend:

- Frontend validation messages
- Toast notifications
- Graceful API failure handling
- Backend validation handling
- Structured JSON responses
- Server-side logging

---

# Output Requirements

The final project should include:

- Modern responsive blog application
- Separate User and Admin authentication
- Secure backend APIs
- Admin dashboard with moderation tools
- Rich blog creation system
- Animations and interactive UI
- Optimized performance
- Clean reusable code structure
- Proper documentation and deployment instructions
