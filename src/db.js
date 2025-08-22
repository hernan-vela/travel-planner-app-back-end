// src/db.js
const mongoose = require('mongoose');

let connectPromise = null; // track in-flight connect

function getUri() {
  return process.env.DATABASE_URL || process.env.MONGODB_URI || '';
}

async function connect(uri = getUri()) {
  if (!uri) throw new Error('Missing DATABASE_URL or MONGODB_URI');

  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const state = mongoose.connection.readyState;
  if (state === 1) return mongoose.connection;        // already connected
  if (state === 2 && connectPromise) return connectPromise; // in progress

  connectPromise = mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // prefer IPv4 to avoid odd DNS issues in CI
  });

  await connectPromise;
  if (process.env.NODE_ENV !== 'test') {
    console.log('Mongoose connected');
  }
  return mongoose.connection;
}

async function close() {
  const state = mongoose.connection.readyState;
  if (state === 0) return;            // already disconnected
  if (state === 3) return;            // disconnecting
  await mongoose.connection.close();   // close this connection
  connectPromise = null;
  if (process.env.NODE_ENV !== 'test') {
    console.log('Mongoose disconnected!');
  }
}

module.exports = { connect, close };