// import mongoose from 'mongoose'
const mongoose = require('mongoose');


// Connect to MongoDB
async function connect() {
  const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/travelp';
  await mongoose.connect(uri);
  console.log(mongoose.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect!');
}

// Disconnect from MongoDB

async function close() {
  await mongoose.disconnect()
  console.log(mongoose.connection.readyState == 0 ? 'Mongoose disconnected!' : 'Mongoose failed to disconnect!')
}

// Best practice export
module.exports = { connect, close }