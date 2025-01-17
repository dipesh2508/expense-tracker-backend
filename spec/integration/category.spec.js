const request = require('supertest');
const app = require('../../app');

describe('Category API', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });
    token = res.body.token;
  });

  describe('POST /api/categories', () => {
    it('should create new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({ name: 'Food' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Food');
    });
  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      await request(app)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({ name: 'Food' });

      const res = await request(app)
        .get('/api/categories')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });
});