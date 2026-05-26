# Blog Application – Full Stack Development Prompt



# Context and Role

As a full-stack developer, your responsibility is to design and develop a modern, scalable, secure, and production-ready Blog Application with separate User and Admin authentication systems. The platform should provide a smooth, responsive, and visually engaging experience while following industry-standard development practices.

The application should support content publishing, user engagement, blog management, analytics, moderation, and secure API communication using a clean architecture and modular folder structure. The system should also prioritize scalability, maintainability, accessibility, performance optimization, and reusable component-based development.

Key expectations include:

- Build a highly responsive and interactive frontend optimized for desktop, tablet, and mobile devices.
- Implement secure backend APIs with authentication, authorization, validation, and error handling.
- Maintain clean code architecture with reusable components, modular services, and scalable folder organization.
- Ensure the project is deployment-ready with optimized performance and proper environment-based configuration management.
- Follow production-level software engineering standards including security best practices, structured logging, and maintainable documentation.

---

# Objective

Develop a complete Full Stack Blog Application that delivers a modern blogging experience for both users and administrators.

The project should include:

- Separate User and Admin authentication systems with protected routes and role-based access control.
- Blog creation, editing, publishing, bookmarking, commenting, and engagement features.
- Admin dashboard for analytics, moderation, blog management, and user management.
- Secure REST APIs or Next.js API routes with proper validation and middleware integration.
- Modern animations and transitions using Framer Motion while maintaining optimized rendering performance.
- Scalable database architecture supporting blogs, comments, categories, analytics, and user activity.
- Production-ready deployment structure with clean architecture and reusable codebase.
- SEO optimization, image optimization, caching strategies, and scalable infrastructure support.

---
---
# Table of Contents

1. [Input Data](#input-data)
2. [Data Processing Requirements](#data-processing-requirements)
3. [Model Requirements](#model-requirements)
4. [Output Requirements](#output-requirements)
5. [Error Handling and Documentation](#error-handling-and-documentation)
6. [Performance and Scalability](#performance-and-scalability)
7. [Tools and Libraries](#tools-and-libraries)
8. [Folder Structure Requirements](#folder-structure-requirements)
9. [Application Features](#application-features)
10. [UI and Animation Requirements](#ui-and-animation-requirements)
11. [Backend Requirements](#backend-requirements)
12. [Database Requirements](#database-requirements)
13. [File Upload System](#file-upload-system)
14. [Search and Filtering](#search-and-filtering)
15. [Contact System](#contact-system)

---

# Input Data

The system should support multiple forms of structured and unstructured input data from frontend forms, APIs, database operations, and media upload systems.

## Supported Input Sources

- User authentication data including email, username, password, and profile details.
- Blog-related data including titles, descriptions, categories, tags, thumbnails, markdown content, and rich text editor content.
- User engagement data such as comments, likes, bookmarks, and reading activity.
- Admin moderation data including analytics filters, reports, and management actions.
- Uploaded media including profile pictures, blog cover images, and inline content images.
- Search and filtering parameters such as categories, keywords, tags, and sorting preferences.

## Input Validation Requirements

- Validate all incoming request payloads before processing.
- Sanitize user-generated content to prevent XSS and malicious input injection.
- Restrict file uploads using size limits and supported file type validation.
- Ensure structured API request and response formatting.
- Reject malformed or unauthorized requests using proper validation middleware.

---

# Data Processing Requirements

Before storing or processing data, implement preprocessing and transformation mechanisms to ensure consistency, security, and optimized application behavior.

## Data Processing and Transformation

- Normalize user input such as trimming whitespace, formatting text, and converting emails to lowercase.
- Generate SEO-friendly slugs automatically from blog titles.
- Compress and optimize uploaded images for faster loading and reduced storage usage.
- Parse markdown or rich text editor content safely for rendering and database storage.
- Sanitize comments and blog content to prevent spam and script injection attacks.

## Database Processing

- Automatically generate timestamps, analytics counters, metadata, and reading time estimations.
- Maintain proper relationships between users, blogs, comments, categories, and bookmarks.
- Use indexing for frequently searched fields to improve query performance.
- Support pagination-ready data handling for scalable API responses.

---

# Model Requirements

The application architecture and database models should support scalability, modularity, maintainability, and future expansion.

## Core Models

- User Model with authentication details, profile information, bookmarks, and activity tracking.
- Blog Model with title, slug, content, categories, tags, analytics, and publication status.
- Comment Model supporting replies, moderation status, and ownership tracking.
- Category and Tag Models for blog organization and filtering.
- Analytics Model for tracking engagement metrics such as views, likes, bookmarks, and trends.

## Architectural Requirements

- Follow modular and reusable architecture principles across frontend and backend.
- Implement clean separation between controllers, routes, services, middleware, and database models.
- Use reusable frontend components with centralized state management.
- Design the system for future scalability including AI integrations, notifications, and real-time features.
- Maintain scalable API structures with proper middleware handling and service abstraction.

---

# Output Requirements

The final project should deliver a fully functional and production-ready Blog Application with modern UI, secure backend architecture, and scalable infrastructure.

## Expected Deliverables

- Responsive and visually modern frontend application.
- Secure User and Admin authentication systems.
- Rich blog creation and editing experience.
- Admin dashboard with analytics and moderation tools.
- Optimized APIs with validation, authorization, and structured responses.
- Scalable database integration with reusable architecture.
- Smooth animations and interactive user experience using Framer Motion.
- Clean reusable codebase with maintainable folder structure.
- Deployment-ready project with documentation and setup instructions.

## Expected Quality Standards

- Optimized application performance and Core Web Vitals.
- Clean and maintainable coding standards.
- Accessibility-friendly semantic UI implementation.
- Reusable components and modular backend structure.
- Secure production-level architecture following industry best practices.

---

# Error Handling and Documentation

Implement structured error handling and proper documentation across frontend, backend, APIs, and deployment configurations.

## Error Handling Requirements

- Use centralized backend error-handling middleware.
- Return structured JSON error responses with proper HTTP status codes.
- Display meaningful frontend validation and API failure messages.
- Handle authentication, authorization, and validation failures gracefully.
- Maintain server-side logs for debugging and monitoring purposes.

## Documentation Requirements

- Provide complete project setup and installation instructions.
- Document API endpoints with request and response examples.
- Include deployment steps and environment variable configurations.
- Maintain clean inline comments for complex logic and reusable modules.
- Add README documentation covering project overview, features, and architecture.

---

# Performance and Scalability

Ensure the application is optimized for performance and capable of handling future growth in users, content, and traffic.

## Performance Optimization

- Implement lazy loading and code splitting for frontend optimization.
- Optimize images, API calls, and rendering performance.
- Use pagination or infinite scrolling for large datasets.
- Reduce unnecessary re-renders using optimized state management.
- Apply caching strategies and CDN-ready asset handling.

## Scalability Requirements

- Design APIs and backend services to support horizontal scaling.
- Maintain modular architecture for easier feature expansion.
- Support database indexing, caching, and optimized querying.
- Prepare infrastructure for deployment on cloud platforms such as Vercel, AWS, or Docker environments.
- Ensure maintainable architecture suitable for long-term collaborative development.

---

# Tools and Libraries

Use modern and industry-standard technologies for frontend, backend, database management, animations, authentication, and deployment.

## Frontend Technologies

- React.js or Next.js
- Tailwind CSS
- Framer Motion
- Redux Toolkit / Zustand / Context API
- Axios or Fetch API
- React Hook Form
- Zod or Yup Validation

## Backend Technologies

- Node.js
- Express.js or Next.js API Routes
- JWT Authentication
- bcrypt
- Nodemailer
- dotenv
- Helmet
- CORS
- Express Rate Limit

## Database and Storage

- MongoDB with Mongoose

### OR

- PostgreSQL with Prisma

## Optional Integrations

- Cloudinary or AWS S3
- Redis
- Google OAuth
- Markdown Editor
- React Query / TanStack Query
- Docker Deployment Support

---

# Folder Structure Requirements

Maintain a scalable and modular folder structure with proper separation of concerns.

## Recommended Folder Structure

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
- config
- public/assets
- types/interfaces
- tests

## Folder Structure Expectations

- Keep reusable logic separated from UI components.
- Organize backend logic into modular layers.
- Maintain scalable naming conventions and clean architecture.
- Ensure future extensibility and maintainability of the project structure.

---

# Application Features

## Authentication System

- User Login and Signup
- Admin Login
- JWT or Session-based Authentication
- Protected Routes
- Role-Based Access Control (RBAC)

## User Features

- View blogs
- Search and filter blogs
- Like and bookmark blogs
- Comment on blogs
- Manage profile
- Upload profile image
- View saved blogs

## Admin Features

- Manage blogs
- Moderate comments
- Manage users
- View analytics
- Publish or remove content

---

# UI and Animation Requirements

## Modern UI Design

- Clean modern UI
- Responsive layouts
- Accessible semantic HTML structure
- Dark mode support

## Animations

Use Framer Motion for:

- Page transitions
- Hover effects
- Modal animations
- Scroll-based animations
- Interactive dashboard effects

---

# Backend Requirements

## API Development

Create secure APIs for:

- Authentication
- Blog CRUD
- Comments
- Bookmarks
- User management
- Admin moderation

## Security Requirements

- JWT authentication
- Input sanitization
- Rate limiting
- Helmet middleware
- XSS protection
- CORS protection
- Secure file upload handling

---

# Database Requirements

Database should support:

- Users
- Blogs
- Comments
- Bookmarks
- Categories
- Analytics

Optional support for:

- Redis caching
- Search indexing
- Cloudinary or AWS S3

---

# File Upload System

Implement secure upload handling for:

- Profile images
- Blog cover images
- Inline blog content images

Features should include:

- File validation
- Size restriction
- Optimized image delivery
- Secure storage handling

---

# Search and Filtering

Implement:

- Keyword search
- Category filtering
- Tag filtering

Sorting options:

- Latest
- Most viewed
- Most liked
- Trending

---

# Contact System

Create a contact form that:

- Sends email notifications
- Validates all fields properly
- Returns structured responses
- Supports animated UI interactions

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
