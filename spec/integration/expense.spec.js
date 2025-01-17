const request = require('supertest');
const app = require('../../app');

describe('Expense API', () => {
  let token;
  let categoryId;

  beforeEach(async () => {
    const authRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });
    token = authRes.body.token;

    const categoryRes = await request(app)
      .post('/api/categories')
      .set('x-auth-token', token)
      .send({ name: 'Food' });
    categoryId = categoryRes.body._id;
  });

  describe('POST /api/expenses', () => {
    it('should create new expense', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('x-auth-token', token)
        .send({
          amount: 100,
          category: categoryId,
          description: 'Groceries'
        });

      expect(res.status).toBe(200);
      expect(res.body.amount).toBe(100);
    });
  });
});