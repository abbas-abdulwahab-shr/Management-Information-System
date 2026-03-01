# Management Information System (MIS)

A full-stack MIS for managing users, departments, programs, reports, and audits. Features include authentication, real-time dashboard updates (SSE), and robust RESTful APIs.

---

## Backend

**Tech Stack:** Node.js, Express, Mongoose, JWT

### Structure
- `src/modules/user/` — User management (CRUD, authentication)
- `src/modules/department/` — Department management, assign head, detail endpoint
- `src/modules/program/` — Program CRUD, assign officer, status updates
- `src/modules/report/` — Summary stats, projects per department, active users
- `src/modules/auditLogs/` — Audit logging
- `src/modules/dashboard/` — SSE for real-time dashboard updates

### Key Endpoints
- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration
- `GET /api/user` — List users
- `GET /api/department` — List departments
- `GET /api/department/:id` — Department details
- `POST /api/department/:id/assign-head` — Assign department head
- `GET /api/program` — List programs
- `POST /api/program/create` — Create program
- `GET /api/program/:id` — Program details
- `PATCH /api/program/:id/status` — Update program status
- `GET /api/report/summary` — Summary stats
- `GET /api/report/projects-per-department` — Projects per department
- `GET /api/report/active-users` — Active users
- `GET /api/dashboard/stream` — SSE dashboard stream

### Features
- JWT authentication & role-based access
- Mongoose models for all entities
- Audit logging for key actions
- SSE for real-time dashboard updates

## Legacy System Integration & Data Migration

This MIS includes imitation of legacy ERP system integration:

- **ERP Sync Endpoint:** `/api/erp/sync` allows the application to fetch and synchronize data from legacy systems.
- **Purpose:** Designed to help organizations migrate historical data and break down data silos by consolidating information from older platforms into the new MIS.
- **Benefits:**
	- Ensures continuity and completeness of records during transition.
	- Reduces manual data entry and errors.
	- Enables unified reporting and analytics across legacy and new data sources.
	- Supports gradual migration, allowing legacy systems to coexist during rollout.

This approach helps organizations modernize their data infrastructure, making all relevant information accessible in one place and supporting smoother digital transformation.

---

## Frontend

**Tech Stack:** React, TypeScript, Chakra UI, Vite

### Structure
- `src/pages/` — Main pages (Dashboard, Users, Departments, Programs, Reports, Audit)
- `src/components/` — Layouts, modals, shared UI
- `src/pages/department/DepartmentDetailPage.tsx` — Department details, staff, programs
- `src/pages/program/ProgramPage.tsx` — Program list, view details, create program
- `src/pages/DashboardPage.tsx` — Real-time dashboard with SSE

### Features
- AuthContext for session management
- Protected routes for authenticated access
- Program creation with officer selection
- Department head assignment
- Real-time dashboard updates via SSE
- Responsive UI with Chakra UI

### Environment
- API base URL via `.env` (`VITE_API_URL`)
- Run with `npm run dev`

---

## Getting Started

### Backend
1. Install dependencies: `npm install`
2. Configure environment variables (MongoDB URI, JWT secret)
3. Start server: `npm run dev`

### Frontend
1. Install dependencies: `npm install`
2. Set `VITE_API_URL` in `.env`
3. Start app: `npm run dev`

---

## Real-Time Dashboard

- Uses SSE (`/api/dashboard/stream`) for live updates of programs, users, and projects per department.

---



## Contribution

- Standard RESTful API patterns
- Modular codebase for easy extension
- PRs and issues welcome

---
