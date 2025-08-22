const request = require('supertest');
const app = require('../src/app');

let token;
let tripId;
let email;
const password = 'password';

async function createExpense(amount, note = 'test expense') {
  const res = await request(app)
    .post('/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send({
      tripId,
      amount,
      description: note
    });

  // many APIs return 201 on create; accept 200 or 201
  expect([200, 201]).toContain(res.statusCode);
  return res.body;
}

describe('Trip Expense Logic', () => {
  beforeAll(async () => {
    // 1) fresh user
    email = `test${Date.now()}@example.com`;

    const reg = await request(app).post('/register').send({ email, password });
    expect([200, 201]).toContain(reg.statusCode);

    // 2) login with PLAINTEXT password
    const login = await request(app).post('/login').send({ email, password });
    // if your API returns something else on login, adjust this:
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
    expect([200, 201]).toContain(tripRes.statusCode);
    tripId = tripRes.body._id || tripRes.body.id;
    expect(tripId).toBeDefined();

    // 4) seed a couple of expenses
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
    // total should be 150 after two expenses above
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
