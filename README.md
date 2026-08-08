# AI Onboarding Platform

An open-source, modular backend platform for AI-assisted customer onboarding in regulated industries.

The project focuses on clean architecture, workflow automation, auditability, and AI governance. It is designed to help organizations build secure onboarding systems with pluggable compliance providers, transparent decision workflows, and a foundation for meeting emerging regulatory requirements such as the EU AI Act.

It models a realistic onboarding lifecycle with authentication, role-based access control, configurable workflows, audit logs, notifications, search, pagination, and extensible integrations for identity verification, compliance services, and AI-powered assistance.

---

## Architecture

The application uses a layered backend design:

```text
Client
  ↓
REST API
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
PostgreSQL
```

---

## Core Features

* JWT authentication & refresh tokens
* Role-based authorization
* Stateful onboarding workflow with controlled status transitions
* Search, filtering, sorting, and pagination
* Audit logging
* Zod validation
* Swagger/OpenAPI documentation
* Health check endpoint
* Background email queue
* Automated tests
* Provider abstraction (foundation for compliance integrations)
* TypeScript

---

## Tech Stack

* TypeScript
* Node.js
* Express
* PostgreSQL
* Zod
* Jest
* Swagger
* Docker
* GitHub Actions

---

## Local Development

### With Docker

```bash
docker compose up --build
```

### With Node.js

```bash
npm install
npm run migrate
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

Interactive API documentation:

```text
/docs
```

---

## Testing

Run the test suite with:

```bash
npm test
```

The project is structured so that unit and integration tests can run against the application layers with minimal coupling to infrastructure.

---

## Repository Structure

```text
src/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── providers/
 ├── middleware/
 ├── validators/
 ├── routes/
 ├── db/
 ├── jobs/
 ├── types/
 ├── utils/
 └── tests/
```
