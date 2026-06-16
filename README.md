# Fintech Onboarding System API

A backend system simulating a fintech onboarding workflow built with Node.js, Express, and PostgreSQL.  
Implements authentication, user-scoped data access, and a simple onboarding status pipeline.

--------------

## Overview

This project models a basic fintech onboarding flow where users can register, authenticate, and manage their own onboarding applications.
Each application is tied to a specific user and can move through different workflow states (e.g. pending, under_review, approved).

--------------

## Features

- User registration and login system
- JWT-based authentication
- Password hashing with bcrypt
- User-scoped application access (authorization layer)
- Application lifecycle status tracking
- RESTful API design
- Layered architecture (routes, controllers, services, middleware)
- PostgreSQL relational database with parameterized queries

--------------

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt

--------------

## Architecture

src/
├── routes/ # API route definitions
├── controllers/ # Request handlers
├── services/ # Business logic + DB queries
├── middleware/ # Auth & request validation
└── db/ # Database connection pool

--------------

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Create a new user |
| POST | /login | Authenticate user and return JWT |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /applications | Get user applications |
| POST | /applications | Create new application |
| PATCH | /applications/:id/status | Update application status |

--------------

## Security Model

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Middleware validates token on protected routes
- Users can only access their own data (user-scoped queries)
- SQL queries use parameterized inputs to prevent injection

--------------

## Run Locally

```bash
npm install
npm run start
