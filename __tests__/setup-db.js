// __tests__/setup-db.js
const { connect, close } = require('../src/db');

// Give slower CI runners more time
jest.setTimeout(30_000);

beforeAll(async () => {
  // CI provides DATABASE_URL; fall back for local runs too
  process.env.DATABASE_URL =
    process.env.DATABASE_URL || 'mongodb://localhost:27017/travelplanner_ci';
  await connect();
});

afterAll(async () => {
  // Close DB (and server if needed)
  try { await close(); } catch {}
  if (global.__server && global.__server.close) {
    await new Promise((r) => global.__server.close(() => r()));
  }
});
