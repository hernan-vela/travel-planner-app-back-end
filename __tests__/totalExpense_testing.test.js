const request = require('supertest');
const app = require('../src/app');

let token;
let tripId;
let email;
const password = 'password';

async function getAnyCategoryId() {
  // Categories are seeded on login for admin and an instance of User
  const r = await request(app)
    .get('/categories')
    .set('Authorization', `Bearer ${token}`);
  if (r.statusCode === 200 && Array.isArray(r.body) && r.body.length) {
    return r.body[0]._id || r.body[0].id;
  }
  return null; // treat category as optional if route not present
}

async function createExpense(amount, note = 'test expense') {
  const payload = {
    trip: tripId,
    amount,
    description: note
  };
  const catId = await getAnyCategoryId();
  if (catId) payload.category = catId;

  const res = await request(app)
    .post('/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  if (![200, 201].includes(res.statusCode)) {
    console.log('EXPENSE DEBUG:', res.statusCode, res.body);
  }
  expect([200, 201]).toContain(res.statusCode);
  return res.body;
}

describe('Trip Expense Logic', () => {
  beforeAll(async () => {
    // 1) fresh user
    email = `test${Date.now()}@example.com`;

    const reg = await request(app).post('/register').send({ email, password });
    expect([200, 201]).toContain(reg.statusCode);

    // 2) login with plaintext password
    const login = await request(app).post('/login').send({ email, password });
    expect(login.statusCode).toBe(200);
    token = login.body.token;
    expect(token).toBeDefined();

    // 3) create a trip
    const tripRes = await request(app)
      .post('/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        location: 'Test City',
        arrivalDate: '08/09/2025',
        departureDate: '09/09/2025'
      });
    if (![200, 201].includes(tripRes.statusCode)) {
      console.log('TRIP CREATE DEBUG:', tripRes.statusCode, tripRes.body);
    }
    expect([200, 201]).toContain(tripRes.statusCode);
    tripId = tripRes.body._id || tripRes.body.id;
    expect(tripId).toBeDefined();

    // 4) seed expenses as example
    await createExpense(100, 'hotel');
    await createExpense(50, 'food');
  });

  it('should return all trips with their total expenses', async () => {
    const res = await request(app)
      .get('/trips')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const mine = res.body.find(t => (t._id || t.id) === tripId);
    expect(mine).toBeDefined();
    expect(Number(mine.totalExpense)).toBe(150);
  });

  it('should return one trip with its total expense', async () => {
    const res = await request(app)
      .get(`/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body._id || res.body.id).toBe(tripId);
    expect(Number(res.body.totalExpense)).toBe(150);
  });

  it('should update the total expense after adding a new expense', async () => {
    await createExpense(25, 'snacks');

    const check = await request(app)
      .get(`/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(check.statusCode).toBe(200);
    expect(Number(check.body.totalExpense)).toBe(175);
  });
});
