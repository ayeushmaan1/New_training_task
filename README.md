# New Training Task

A complete full-stack development project designed to follow real-world software engineering practices instead of basic tutorial-level implementation.  
This repository focuses on creating a scalable, maintainable, secure, and production-ready application architecture using modern frontend and backend technologies.

The project demonstrates how frontend systems, backend APIs, authentication flows, database integration, middleware handling, and reusable component structures work together in a real development environment.

---

# Table of Contents

- Project Introduction
- Objectives of the Project
- Core Features
- Technology Stack
- Project Architecture
- Folder Structure
- Local Machine Setup
- Installing Dependencies
- Running the Project
- Environment Variables
- Backend Workflow
- Frontend Workflow
- API Structure
- Authentication Flow
- Database Design
- Development Guidelines
- Future Improvements
- Common Errors and Fixes
- Deployment Suggestions
- Learning Outcomes
- Contribution Guide
- License

---

# Project Introduction

The purpose of this project is to simulate how modern full-stack applications are developed in actual companies and production environments.

Instead of creating a simple CRUD application, this project is structured in a way that helps developers understand:

- Clean architecture principles
- Modular backend development
- Scalable frontend structure
- Authentication systems
- API communication
- Database handling
- Middleware implementation
- Error handling patterns
- State management concepts
- Secure coding practices

This project can be used for:

- Learning full-stack development
- Resume projects
- Backend practice
- API development practice
- Team collaboration learning
- Understanding scalable project structures

---

# Objectives of the Project

The main objectives behind this project are:

## 1. Build a Scalable Architecture

The application structure is organized in a modular way so future features can be added without rewriting the entire codebase.

---

## 2. Learn Backend API Development

The backend demonstrates:

- Route handling
- Controllers
- Middleware
- Authentication
- Validation
- Database operations
- Error management

---

## 3. Understand Frontend Structure

The frontend is separated into reusable components and pages to improve maintainability and readability.

---

## 4. Implement Authentication

The project includes secure authentication systems using JWT tokens and password hashing.

---

## 5. Improve Production-Level Understanding

The folder structure and development approach are inspired by real-world applications used in professional environments.

---

# Core Features

# Authentication System

The authentication system is responsible for securely identifying users and controlling access to protected resources.

### Features Included

- User registration
- User login
- Password hashing using bcrypt
- JWT token generation
- Protected routes
- Authentication middleware
- Session handling

### Why It Matters

Authentication is one of the most important parts of any modern application because it protects sensitive data and ensures only authorized users can access private functionality.

---

# User Management System

The user system allows management of user-related operations.

### Features

- Profile handling
- User data storage
- Update user information
- Role management
- Activity tracking

---

# Frontend Features

The frontend is designed to be clean, responsive, and reusable.

### Features

- Responsive design
- Component-based architecture
- Mobile-friendly layouts
- Reusable UI sections
- Page routing
- API integration

### Why Component-Based Design Is Important

Reusable components reduce duplicate code and improve maintainability.

Example:

Instead of creating multiple buttons manually throughout the project, a reusable button component can be used everywhere.

---

# Backend Features

The backend follows a structured REST API architecture.

### Features

- RESTful APIs
- Middleware handling
- Error handling
- Validation
- Database connectivity
- Modular route structure

### Why This Structure Is Useful

Separating routes, controllers, middleware, and models makes the application easier to scale and debug.

---

# Database Features

The database stores and manages application data.

### Features

- Structured schema design
- Relationships between collections
- CRUD operations
- Validation
- Query optimization

---

# Technology Stack

# Frontend Technologies

## React.js

Used for building the frontend user interface.

### Why React?

- Component-based
- Fast rendering
- Easy state management
- Reusable UI logic

---

## Tailwind CSS

Used for styling the application.

### Why Tailwind?

- Faster UI development
- Utility-first approach
- Responsive styling
- Cleaner CSS management

---

## Axios

Used for API communication between frontend and backend.

### Why Axios?

- Simple HTTP requests
- Better error handling
- Cleaner API integration

---

# Backend Technologies

## Node.js

Used as the backend runtime environment.

### Why Node.js?

- Fast execution
- JavaScript everywhere
- Event-driven architecture

---

## Express.js

Used for creating backend APIs.

### Why Express?

- Lightweight
- Flexible
- Easy route handling

---

# Database Technologies

## MongoDB

Used for storing application data.

### Why MongoDB?

- Flexible schema
- NoSQL structure
- Fast development

---

## Mongoose

Used for MongoDB schema management.

### Why Mongoose?

- Schema validation
- Easy database interaction
- Better query handling

---

# Project Architecture

The project follows a layered architecture.

```text
Frontend (React)
       ↓
API Calls (Axios)
       ↓
Backend Routes
       ↓
Controllers
       ↓
Services / Logic
       ↓
Database Models
       ↓
MongoDB Database
```

This separation helps maintain clean and understandable code.

---

# Folder Structure

```bash
project-root/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── assets/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   ├── utils/
│   ├── services/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# Understanding the Folder Structure

# Client Folder

Contains the frontend React application.

## components/

Reusable UI elements like:

- Navbar
- Buttons
- Cards
- Forms

---

## pages/

Contains major application screens.

Example:

- Home Page
- Login Page
- Dashboard

---

## services/

Contains API request logic.

Example:

```javascript
axios.get("/api/users");
```

---

# Server Folder

Contains the backend application.

---

## routes/

Defines API endpoints.

Example:

```javascript
router.post("/login", loginUser);
```

---

## controllers/

Contains business logic.

Example:

```javascript
const loginUser = async (req, res) => {};
```

---

## middleware/

Contains reusable backend logic like:

- Authentication checking
- Error handling
- Validation

---

## models/

Contains database schemas.

---

# Local Machine Setup

# Step 1: Install Required Software

Before running the project, install the following software on your machine.

---

## Install Node.js

Download from:

https://nodejs.org/

### Verify Installation

```bash
node -v
npm -v
```

If version numbers appear, installation was successful.

---

## Install MongoDB

You can either:

- Install MongoDB locally
- Use MongoDB Atlas cloud database

MongoDB Atlas is recommended for beginners.

Website:

https://www.mongodb.com/cloud/atlas

---

## Install Git

Download Git from:

https://git-scm.com/

### Verify Installation

```bash
git --version
```

---

# Cloning the Repository

Open terminal and run:

```bash
git clone https://github.com/ayeushmaan1/New_training_task.git
```

---

# Move into the Project Folder

```bash
cd New_training_task
```

---

# Installing Backend Dependencies

Move into the server directory.

```bash
cd server
```

Install required packages.

```bash
npm install
```

This command installs all backend dependencies mentioned in `package.json`.

---

# Installing Frontend Dependencies

Open another terminal.

Move into the client directory.

```bash
cd client
```

Install frontend dependencies.

```bash
npm install
```

---

# Environment Variables Setup

Inside the server folder create a `.env` file.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key
```

---

# How to Get MongoDB Connection String

If using MongoDB Atlas:

1. Create account
2. Create cluster
3. Create database user
4. Open "Connect"
5. Choose "Drivers"
6. Copy connection string

Example:

```env
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

# Running the Backend

Inside the server folder run:

```bash
npm run dev
```

Expected Output:

```bash
Server running on port 5000
Database connected successfully
```

---

# Running the Frontend

Inside the client folder run:

```bash
npm run dev
```

Expected Output:

A localhost URL appears.

Example:

```bash
http://localhost:5173
```

Open it in your browser.

---

# Full Project Execution Flow

## Step 1

Frontend sends request using Axios.

---

## Step 2

Backend route receives request.

---

## Step 3

Controller processes logic.

---

## Step 4

Database operation occurs.

---

## Step 5

Response is returned to frontend.

---

# API Structure

# Authentication APIs

| Method | Endpoint | Purpose |
|--------|----------|----------|
| POST | /api/auth/register | Create user |
| POST | /api/auth/login | Login user |

---

# User APIs

| Method | Endpoint | Purpose |
|--------|----------|----------|
| GET | /api/users/profile | Fetch profile |
| PUT | /api/users/update | Update profile |

---

# Authentication Flow

```text
User Login
    ↓
Credentials Sent
    ↓
Backend Validation
    ↓
Password Verification
    ↓
JWT Token Generated
    ↓
Token Returned
    ↓
Frontend Stores Token
    ↓
Protected Routes Accessible
```

---

# Common Errors and Fixes

# Error: node is not recognized

### Solution

Install Node.js properly and restart terminal.

---

# Error: MongoDB connection failed

### Solution

- Check internet connection
- Verify MongoDB URI
- Verify database username/password

---

# Error: Port already in use

### Solution

Change PORT value inside `.env`.

---

# Development Guidelines

- Keep components reusable
- Avoid duplicate code
- Use environment variables
- Separate business logic properly
- Follow clean folder structure
- Write meaningful variable names

---

# Future Improvements

- OAuth Authentication
- Redis caching
- Real-time chat
- Notification system
- File uploads
- AI recommendations
- Docker support
- CI/CD pipelines

---

# Deployment Suggestions

# Frontend Deployment

You can deploy frontend on:

- Vercel
- Netlify

---

# Backend Deployment

You can deploy backend on:

- Render
- Railway
- AWS
- DigitalOcean

---

# Database Deployment

Use:

- MongoDB Atlas

---

# Learning Outcomes

After completing this project you will understand:

- Full-stack architecture
- REST APIs
- Authentication systems
- Database integration
- Backend structuring
- Frontend component architecture
- API communication
- Production-level folder organization

---

# Contribution Guide

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create Pull Request

---

# License

This project is licensed under the MIT License.

---

# Author

Developed by Ayushmaan Dwivedi

GitHub Repository:

https://github.com/ayeushmaan1/New_training_task
