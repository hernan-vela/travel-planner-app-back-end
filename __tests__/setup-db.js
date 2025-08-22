const mongoose = require('mongoose');

afterAll(async () => {
  try { await mongoose.connection.close(); } catch {}
  if (global.__server && global.__server.close) {
    await new Promise((resolve) => global.__server.close(() => resolve()));
  }
});
