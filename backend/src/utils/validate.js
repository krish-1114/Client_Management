const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s\-()]{6,17}$/;
const STATUSES = ['Active', 'Inactive'];

const str = (v) => (typeof v === 'string' ? v.trim() : '');

function validateClient(body) {
  const b = body || {};
  const data = {
    name: str(b.name),
    contactPerson: str(b.contactPerson),
    email: str(b.email).toLowerCase(),
    phone: str(b.phone),
    address: str(b.address),
    status: str(b.status) || 'Active',
    notes: str(b.notes),
  };
  const errors = {};

  if (!data.name) errors.name = 'Client name is required';
  else if (data.name.length > 120) errors.name = 'Client name must be 120 characters or fewer';

  if (!data.contactPerson) errors.contactPerson = 'Contact person is required';
  else if (data.contactPerson.length > 120) errors.contactPerson = 'Contact person must be 120 characters or fewer';

  if (!data.email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address';

  if (!data.phone) errors.phone = 'Phone is required';
  else if (!PHONE_RE.test(data.phone)) errors.phone = 'Enter a valid phone number (7-15 digits, optional +)';

  if (!STATUSES.includes(data.status)) errors.status = 'Status must be Active or Inactive';
  if (data.address.length > 300) errors.address = 'Address must be 300 characters or fewer';
  if (data.notes.length > 2000) errors.notes = 'Notes must be 2000 characters or fewer';

  return { data, errors, valid: Object.keys(errors).length === 0 };
}

module.exports = { validateClient, STATUSES };
