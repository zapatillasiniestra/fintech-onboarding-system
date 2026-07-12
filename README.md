# Fintech Onboarding API

A production-oriented backend service for managing customer onboarding workflows in fintech environments. The project focuses on clean architecture, security, scalability, and maintainability rather than framework-specific implementations.

It models a typical onboarding lifecycle, providing authenticated access, role-based administration, controlled workflow transitions, auditability, and operational tooling expected in modern backend services.

---

## Architecture

The application follows a layered architecture that separates HTTP concerns, business rules, and data access.

```text
Client
    │
 REST API
    │
Controllers
    │
Services
    │
Repositories
    │
PostgreSQL
```

This separation keeps business logic independent from infrastructure, making the system easier to test, maintain, and extend.

---

## Core Capabilities

* Secure authentication and session management
* Role-based authorization
* Stateful onboarding workflow with controlled status transitions
* Search, filtering, sorting and pagination
* Audit trail for administrative operations
* API documentation
* Health monitoring endpoint
* Automated testing and continuous integration

---

## Technology

* Node.js
* Express
* PostgreSQL
* Docker
* GitHub Actions

---

## Local Development

```bash
docker compose up --build
```

The API is available at:

```
http://localhost:3000
```

Interactive API documentation:

```
/docs
```

---

## Testing

The project includes automated unit and integration tests executed locally with:

```bash
npm test
```

Every push and pull request is automatically validated through GitHub Actions.

---

## Repository Structure

```text
src/
 ├── constants/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── middleware/
 ├── validators/
 ├── routes/
 ├── db/
 ├── utils/
 └── tests/
```
