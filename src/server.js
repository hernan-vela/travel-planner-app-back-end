require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { connect } = require('./db'); // uses DATABASE_URL / MONGODB_URI

const port = process.env.PORT || 8080;

async function start() {
  try {
    // Connect to Mongo first
    await connect();
    const server = app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
    // make the server accessible for tests/cleanup if ever needed
    global.__server = server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();