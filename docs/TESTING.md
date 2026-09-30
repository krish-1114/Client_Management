# Testing Results

## Automated / build checks (done during generation)
| Check | Result |
|---|---|
| Backend loads (`require('./src/app')`) | Pass |
| `validateClient({})` returns 4 required-field errors | Pass |
| `validateClient` accepts valid input, lowercases email | Pass |
| Invalid email/phone rejected | Pass |
| Angular production build (strict templates) | Pass |

## Manual checklist (run with MongoDB + both servers, then tick)
- [ ] Create client with all fields -> appears in list, "Client created" activity
- [ ] Create with empty required fields -> field errors shown (client and server)
- [ ] Invalid email / phone -> error shown
- [ ] Duplicate email (also different letter case) -> "already exists" on email field
- [ ] Edit client -> "Information updated: ..." activity lists changed fields
- [ ] Edit with no changes -> no new activity
- [ ] Add note -> appears in activity timeline
- [ ] Search by name, contact person, email, phone
- [ ] Filter Active / Inactive
- [ ] Pagination (create 12+ clients) -> next/previous work
- [ ] Delete client -> removed from list; deleting last item on page 2 returns to page 1
- [ ] Dashboard counts match list; recent clients show newest 5
- [ ] Stop API -> friendly error message on pages
