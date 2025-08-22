// src/app.js
const express = require('express');
const cors = require('cors');

// Routers
const expense_routes = require('./routes/expense_routes.js');
const category_routes = require('./routes/category_routes.js');
const trip_routes = require('./routes/trip_routes.js');
const auth_routes = require('./routes/auth_routes.js');

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use(auth_routes);
app.use(trip_routes);
app.use(expense_routes);
app.use(category_routes);

// global error handler (keep after routes)
app.use((err, req, res, next) => {
  // Eslint disable next line, means n-console
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server' });
});

module.exports = app;
