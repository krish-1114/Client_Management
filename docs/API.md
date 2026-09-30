# API Documentation
Base URL: `http://localhost:5000/api`. All bodies are JSON.

## Client object
```json
{ "_id": "...", "name": "Acme Ltd", "contactPerson": "Jane Doe", "email": "jane@acme.com",
  "phone": "+91 98765 43210", "address": "Ahmedabad", "status": "Active", "notes": "",
  "createdAt": "...", "updatedAt": "..." }
```

## Endpoints
### GET /clients
Query: `search` (name/contact/email/phone), `status` (Active|Inactive), `page` (default 1), `limit` (default 10, max 50).
200: `{ "data": [Client], "page": 1, "limit": 10, "total": 25, "totalPages": 3 }`

### POST /clients
Body: `name*, contactPerson*, email*, phone*, address, status, notes`
201: Client. 400: `{ "message": "Validation failed", "errors": { "email": "..." } }`. 409: duplicate email.

### GET /clients/:id  ->  200 Client | 404
### PUT /clients/:id  ->  same body/rules as POST. 200 Client | 400 | 404 | 409
### DELETE /clients/:id  ->  200 `{ "message": "Client deleted" }` | 404
### GET /clients/:id/activities  ->  200 `[ { "_id", "client", "type", "message", "createdAt" } ]` (newest first)
### POST /clients/:id/notes
Body: `{ "text": "Called client" }` (1-1000 chars). 201: Activity (`type: "note_added"`). 400 | 404
### GET /dashboard
200: `{ "total", "active", "inactive", "recentClients": [Client x5], "recentActivities": [Activity with client {_id,name} x8] }`
### GET /health  ->  `{ "status": "ok" }`

## Validation rules
- name, contactPerson: required, max 120
- email: required, valid format, unique (stored lowercase)
- phone: required, `^\+?[0-9][0-9\s\-()]{6,17}$`
- status: Active | Inactive
- address max 300, notes max 2000
