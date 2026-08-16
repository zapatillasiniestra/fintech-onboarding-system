# AI Onboarding Platform

An open-source backend platform for AI-assisted customer onboarding in regulated industries.

The project is built around modular architecture, identity verification, AI-assisted assessments, auditability, and extensible provider integrations.

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
* RBAC
* Controlled onboarding status transitions
* Identity verification
* Search, filtering, sorting, and pagination
* Audit logging
* Zod validation
* Swagger/OpenAPI documentation
* Health check endpoint
* Background email queue
* Automated tests
* AI-assisted risk assessment
* Persisted AI assessments
  
---

## Tech Stack

* TypeScript
* NodeJS
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

Swagger documentation:

```text
http://localhost:3000/docs
```

---

## Testing

Run the test suite with:

```bash
npm test
```

Build with:

```bash
npm run build
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
