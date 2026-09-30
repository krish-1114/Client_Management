const express = require('express');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const Activity = require('../models/Activity');
const { validateClient } = require('../utils/validate');
const { asyncHandler } = require('../middleware/errors');

const router = express.Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const FIELDS = ['name', 'contactPerson', 'email', 'phone', 'address', 'status', 'notes'];

router.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Client not found' });
  next();
});

// List: search + status filter + pagination
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const filter = {};

    if (['Active', 'Inactive'].includes(req.query.status)) filter.status = req.query.status;

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: rx }, { contactPerson: rx }, { email: rx }, { phone: rx }];
    }

    const [data, total] = await Promise.all([
      Client.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Client.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) });
  })
);

// Create
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { data, errors, valid } = validateClient(req.body);
    if (!valid) return res.status(400).json({ message: 'Validation failed', errors });

    const client = await Client.create(data);
    await Activity.create({ client: client._id, type: 'created', message: 'Client created' });
    res.status(201).json(client);
  })
);

// Read one
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  })
);

// Update
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { data, errors, valid } = validateClient(req.body);
    if (!valid) return res.status(400).json({ message: 'Validation failed', errors });

    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const changed = FIELDS.filter((f) => client[f] !== data[f]);
    client.set(data);
    await client.save();

    if (changed.length) {
      await Activity.create({
        client: client._id,
        type: 'updated',
        message: 'Information updated: ' + changed.join(', '),
      });
    }
    res.json(client);
  })
);

// Delete (also removes its activities)
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await Activity.deleteMany({ client: client._id });
    res.json({ message: 'Client deleted' });
  })
);

// Activity history
router.get(
  '/:id/activities',
  asyncHandler(async (req, res) => {
    const exists = await Client.exists({ _id: req.params.id });
    if (!exists) return res.status(404).json({ message: 'Client not found' });
    const activities = await Activity.find({ client: req.params.id }).sort({ createdAt: -1 }).lean();
    res.json(activities);
  })
);

// Add a note (recorded as an activity)
router.post(
  '/:id/notes',
  asyncHandler(async (req, res) => {
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text) return res.status(400).json({ message: 'Validation failed', errors: { text: 'Note cannot be empty' } });
    if (text.length > 1000)
      return res.status(400).json({ message: 'Validation failed', errors: { text: 'Note must be 1000 characters or fewer' } });

    const exists = await Client.exists({ _id: req.params.id });
    if (!exists) return res.status(404).json({ message: 'Client not found' });

    const activity = await Activity.create({ client: req.params.id, type: 'note_added', message: text });
    res.status(201).json(activity);
  })
);

module.exports = router;
