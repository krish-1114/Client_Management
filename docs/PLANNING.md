# Planning Document

## 1. Requirement understanding
A small internal tool for a company to keep client records: CRUD, search/filter/pagination, a detail page with notes and activity history, and a dashboard with counts. Validation covers required fields, email format, phone format and duplicates.

## 2. Architecture
```
Angular 17 SPA (standalone components)  --HTTP/JSON-->  Express REST API  --Mongoose-->  MongoDB
  pages -> ClientService (HttpClient)                    routes -> validate -> models
```
- Dev: Angular dev server proxies `/api` to `localhost:5000` (no CORS issues).
- API is stateless; validation is duplicated on the client (UX) and server (source of truth).

## 3. Database design (MongoDB)
**clients**: `_id`, `name`*, `contactPerson`*, `email`* (unique, lowercased), `phone`*, `address`, `status` (Active|Inactive), `notes`, `createdAt`, `updatedAt`
**activities**: `_id`, `client` (ref, indexed), `type` (created|updated|note_added), `message`, `createdAt`
Users: skipped (optional in brief; no auth requirement).
Decision: activities live in their own collection (unbounded growth, easy to paginate/query) and are removed when a client is deleted.

## 4. API list and data flow
| Method | Path | Purpose |
|---|---|---|
| GET | /api/clients?search&status&page&limit | List |
| POST | /api/clients | Create (+ "created" activity) |
| GET | /api/clients/:id | Details |
| PUT | /api/clients/:id | Update (+ "updated" activity listing changed fields) |
| DELETE | /api/clients/:id | Delete client + its activities |
| GET | /api/clients/:id/activities | Activity history |
| POST | /api/clients/:id/notes | Add note (+ "note_added" activity) |
| GET | /api/dashboard | Totals, recent clients, recent activity |

Flow: form -> `ClientService` -> route -> `validateClient` -> Mongoose -> JSON. Errors return `{ message, errors: { field: msg } }` (400 validation, 409 duplicate email, 404 not found).

## 5. UI pages
- `/` Dashboard
- `/clients` List (search, status filter, pagination, row actions)
- `/clients/new`, `/clients/:id/edit` Form
- `/clients/:id` Details + notes + activity timeline

## 6. Approach and assumptions
- Email is the duplicate key (case-insensitive). Names may repeat (different branches).
- Phone: optional `+`, 7-15 digits, spaces/dashes/brackets allowed.
- A "note" is stored as an activity entry; the client's own `notes` field is edited via the form.
- "Recently added" = 5 newest clients. Page size is 10.
- No authentication (out of scope).
