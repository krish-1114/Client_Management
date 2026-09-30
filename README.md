# Spreadme - Client Management System

Angular 17 + Node.js (Express) + MongoDB (Mongoose).

## Prerequisites
- Node.js 18+ (20+ recommended)
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

## Setup

**1. API**
```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm start                 # http://localhost:5000
```

**2. Angular app** (new terminal)
```bash
cd frontend
npm install
npm start                 # http://localhost:4200  (proxies /api -> :5000)
```

Open http://localhost:4200

## Structure
```
backend/   Express API, Mongoose models (Client, Activity), validation
frontend/  Angular standalone components: dashboard, list, form, details
docs/      PLANNING, TASKS, API, AI_USAGE, TESTING
```

## Features
- Add / edit / delete / view clients (name, contact person, email, phone, address, status, notes)
- Search (name, contact person, email, phone), Active/Inactive filter, pagination
- Client details with notes and activity history (created, updated, note added)
- Dashboard: total, active, inactive, recently added clients, recent activity
- Validation on client and server; duplicate email handling (409)

## Docs
- [Planning](docs/PLANNING.md) | [Tasks](docs/TASKS.md) | [API](docs/API.md) | [AI usage](docs/AI_USAGE.md) | [Testing](docs/TESTING.md)
"# Client_Management" 
