const request = require('supertest');
const app = require('../src/app');

let token = '';
let tripId = '';
let email = '';
const password = 'password';

beforeAll(async () => {
  // register a fresh user
  email = `test${Date.now()}@example.com`;

  const reg = await request(app).post('/register').send({ email, password });
  expect([200, 201]).toContain(reg.statusCode);

  // login with PLAINTEXT password
  const login = await request(app).post('/login').send({ email, password });
  expect(login.statusCode).toBe(200);
  token = login.body.token;
  expect(token).toBeDefined();

  // create one trip to read later
  const tripRes = await request(app)
    .post('/trips')
    .set('Authorization', `Bearer ${token}`)
    .send({
      location: 'Test City',
      arrivalDate: '2025-09-08',
      departureDate: '2025-09-09'
    });

  expect([200, 201]).toContain(tripRes.statusCode);
  tripId = tripRes.body._id || tripRes.body.id;
  expect(tripId).toBeDefined();
});

describe('Get one trip and check keys', () => {
  it('should return one trip with _id, location, arrivalDate, departureDate, totalExpense', async () => {
    const res = await request(app)
      .get(`/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('location');
    expect(res.body).toHaveProperty('arrivalDate');
    expect(res.body).toHaveProperty('departureDate');
    expect(res.body).toHaveProperty('totalExpense');
  });
});

describe('Login works', () => {
  it('should return 200 on /login', async () => {
    const res = await request(app).post('/login').send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('Trip ID exists', () => {
  it('should fetch the trip we created', async () => {
    const res = await request(app)
      .get(`/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id || res.body.id).toBe(tripId);
  });
});
