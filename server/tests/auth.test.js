const request = require('supertest');
process.env.NODE_ENV = 'test';
const app = require('../server');
const store = require('../data/userStore');

describe('Auth module', () => {
  beforeEach(() => store._clearAll());

  it('rejects invalid registration payload', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password|Password/i);
  });

  it('registers and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com', password: 'hunter22', name: 'Testy', role: 'volunteer'
    });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.token).toBeTypeOf('string');
  });

  it('prevents duplicate emails', async () => {
    await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'secret12' });
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'another12' });
    expect(res.status).toBe(409);
  });

  it('login works with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({ email: 'u@x.com', password: 'abcdef6' });
    const res = await request(app).post('/api/auth/login').send({ email: 'u@x.com', password: 'abcdef6' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('login fails with bad password', async () => {
    await request(app).post('/api/auth/register').send({ email: 'm@n.com', password: 'abcdef6' });
    const res = await request(app).post('/api/auth/login').send({ email: 'm@n.com', password: 'wrongpw' });
    expect(res.status).toBe(401);
  });

  it('GET /me returns current user when authorized', async () => {
    const reg = await request(app).post('/api/auth/register').send({ email: 'z@z.com', password: 'abcdef6' });
    const token = reg.body.token;
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('z@z.com');
  });

  it('GET /me rejects without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
