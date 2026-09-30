const express = require('express');
const cors = require('cors');
const clientRoutes = require('./routes/clients');
const dashboardRoutes = require('./routes/dashboard');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/clients', clientRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
