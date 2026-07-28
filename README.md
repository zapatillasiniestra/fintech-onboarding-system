# Fintech Onboarding API

A product-oriented backend for customer onboarding in regulated environments.

The project focuses on clean separation of concerns, predictable workflows, auditability, and maintainability.

It models a realistic onboarding lifecycle with authenticated access, role-based administration, controlled status transitions, search and pagination, and a foundation for compliance integrations and automation.

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

* JWT authentication
* Role-based authorization
* Stateful onboarding workflow with controlled status transitions
* Search, filtering, sorting, and pagination
* Audit trail for administrative actions
* Zod validation
* Swagger/OpenAPI documentation
* Health check endpoint
* Background email job queue
* Automated tests
* Continuous integration

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
 ├── middleware/
 ├── validators/
 ├── routes/
 ├── db/
 ├── jobs/
 ├── types/
 ├── utils/
 └── tests/
```

---

## Project Goals

The codebase is designed to resemble a real backend foundation for regulated onboarding workflows. It is intended to be a strong example of backend architecture.

Future extensions can include:

* document uploads
* compliance providers
* OCR and data extraction (AI)
* AI-assisted onboarding review
* more screening
* more workflow automation
