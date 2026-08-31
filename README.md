<img width="1351" height="678" alt="Screenshot 2026-08-31 151007" src="https://github.com/user-attachments/assets/6dcdab2e-91e8-4069-9eae-27207088bbe1" />
# GymPass — Multi-Tenant Gym Membership & Attendance Platform

A full-stack MERN application for gym owners and staff to manage memberships, track payments, monitor attendance via QR check-in, and automatically remind members of upcoming or overdue payments.

## Project Status

🚧 Backend and frontend functionally complete — Project 2 of a multi-project MERN + production engineering learning roadmap. Visual polish and deployment pending.

## Problem

Small, independently-run gyms track memberships in notebooks or spreadsheets. Payment due dates get missed, members lapse without anyone noticing, and there's no reliable record of attendance or payment history.

## Core Features

- [x] Multi-tenant architecture — a single account can belong to multiple gyms, each with its own role
- [x] Role-based authorization (owner / admin / staff) enforced at the API layer
- [x] Staff invitations (email-based, existing accounts only)
- [x] Membership plan management (create, deactivate, prevent deletion while in use)
- [x] Member management with plan assignment and due-date tracking
- [x] Payment recording with automatic due-date extension (transaction-safe)
- [x] QR-code-based check-in with camera scanning and duplicate-scan protection
- [x] Overdue / upcoming-due member views
- [x] Automated daily email reminders to gym owners (scheduled job)
- [x] Full React frontend covering every workflow above

## Tech Stack

**Frontend:** React, React Router, Axios, Context API, Tailwind CSS, `html5-qrcode`, `qrcode.react`
**Backend:** Node.js, Express
**Database:** MongoDB (Atlas), Mongoose
**Auth:** JWT, bcrypt
**Scheduled Jobs:** node-cron
**Email:** Resend

## Project Structure

```
.
├── client/                    # React frontend
│   └── src/
│       ├── api/               # Axios instance + API call modules
│       ├── components/        # Reusable UI (ProtectedRoute, etc.)
│       ├── context/           # AuthContext, GymContext
│       ├── pages/             # Route-level pages
│       └── utils/             # Shared logic (memberStatus, etc.)
├── server/                    # Express backend
│   └── src/
│       ├── models/            # Mongoose schemas
│       ├── routes/            # API endpoint definitions
│       ├── controllers/       # Route logic
│       ├── middleware/        # Auth + role-authorization middleware
│       ├── jobs/               # Scheduled reminder job
│       └── config/            # DB connection
└── README.md
```

## Data Models

- **User** — staff account (login credentials)
- **Gym** — the tenant/organization
- **StaffMembership** — connects a User to a Gym with a specific role (owner/admin/staff)
- **MembershipPlan** — reusable plan definitions per gym (price, duration)
- **Member** — a gym's customer; does not log in
- **CheckIn** — a timestamped visit record
- **Payment** — payment history with a full due-date audit trail (previous/new due date)

## Getting Started

### Backend

```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, RESEND_API_KEY
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Environment Variables

See `server/.env.example` for required variables (MongoDB Atlas connection string with replica set support for transactions, JWT secret, Resend API key, port).

## Key Architectural Decisions

- **Multi-tenancy via `gym` field scoping** — every gym-owned resource carries a `gym` reference, checked on every query, mirroring how single-user ownership worked in the previous project but extended to a team/organization boundary.
- **Two-tier authorization** — `protect` (authentication) and `requireGymRole` (authorization) are separate middleware, composed together on protected routes.
- **URL-driven gym context** — the "current gym" in the frontend is derived from the route (`/gyms/:gymId/...`), not stored in memory, so it survives refreshes and is linkable.
- **Transactional payment recording** — payment creation and the resulting due-date update are wrapped in a MongoDB transaction, since a partial failure would leave the system in a misleading state (payment recorded, but due date unchanged).
- **`createGym` deliberately does not use a transaction** — a failure there produces only an orphaned, invisible record, not a misleading financial state, so the added complexity wasn't justified.

## Roadmap

This is Project 2 of a multi-project MERN learning path. Remaining work: visual polish pass, and deployment (Docker, VPS, Nginx, HTTPS) — planned as a dedicated phase after all projects are built.

## License

Personal learning project — not currently licensed for reuse.
