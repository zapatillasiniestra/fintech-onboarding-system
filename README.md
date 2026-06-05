# Fintech Onboarding System API

Node.js, Express and PostgreSQL backend simulating a fintech onboarding workflow with JWT authentication and user-scoped data access.

## Features

- User registration
- User authentication with JWT
- Password hashing using bcrypt
- PostgreSQL database
- User-owned applications
- Protected API routes
- Middleware-based authorization
- REST API architecture

## Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

## Architecture

```
src/
├── routes/
├── controllers/
├── services/
├── middleware/
└── db/
```

## API Endpoints

- POST /register
- POST /login
- GET /applications
- POST /applications

## Security

- Password hashing
- JWT authentication
- User-scoped data access
- Parameterized SQL queries

## Run Locally

```bash
npm install
npm start
```