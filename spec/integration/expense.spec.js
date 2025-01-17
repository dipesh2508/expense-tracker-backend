const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

describe('Expense API', () => {
  let token, otherToken;
  let categoryId;
  let expenseId;

  beforeEach(async () => {
    // Clear collections
    await mongoose.connection.collection('expenses').deleteMany({});
    await mongoose.connection.collection('categories').deleteMany({});

    // Create test user and get token
    const authRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });
    token = authRes.body.token;

    // Create another user for authorization tests
    const otherAuthRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Other User',
        email: 'other@test.com',
        password: 'password123'
      });
    otherToken = otherAuthRes.body.token;

    // Create test category
    const categoryRes = await request(app)
      .post('/api/categories')
      .set('x-auth-token', token)
      .send({ name: 'Food' });
    categoryId = categoryRes.body._id;
  });

  describe('POST /api/expenses', () => {
    it('should create new expense with valid data', async () => {
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
      expect(res.body.category).toBe(categoryId.toString());
    });

    it('should fail without amount', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('x-auth-token', token)
        .send({
          category: categoryId,
          description: 'Groceries'
        });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('Amount is required');
    });

    it('should fail with invalid category', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('x-auth-token', token)
        .send({
          amount: 100,
          category: new mongoose.Types.ObjectId(),
          description: 'Groceries'
        });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('Invalid category');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .send({
          amount: 100,
          category: categoryId,
          description: 'Groceries'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/expenses', () => {
    beforeEach(async () => {
      const expenseRes = await request(app)
        .post('/api/expenses')
        .set('x-auth-token', token)
        .send({
          amount: 100,
          category: categoryId,
          description: 'Groceries'
        });
      expenseId = expenseRes.body._id;
    });

    it('should get all expenses', async () => {
      const res = await request(app)
        .get('/api/expenses')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].amount).toBe(100);
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .get('/api/expenses');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/expenses/:id', () => {
    beforeEach(async () => {
      const expenseRes = await request(app)
        .post('/api/expenses')
        .set('x-auth-token', token)
        .send({
          amount: 100,
          category: categoryId,
          description: 'Groceries'
        });
      expenseId = expenseRes.body._id;
    });

    it('should update expense', async () => {
      const res = await request(app)
        .put(`/api/expenses/${expenseId}`)
        .set('x-auth-token', token)
        .send({
          amount: 200,
          category: categoryId,
          description: 'Updated Groceries'
        });

      expect(res.status).toBe(200);
      expect(res.body.amount).toBe(200);
      expect(res.body.description).toBe('Updated Groceries');
    });

    it('should fail with non-existent expense', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/expenses/${fakeId}`)
        .set('x-auth-token', token)
        .send({
          amount: 200,
          category: categoryId,
          description: 'Updated Groceries'
        });

      expect(res.status).toBe(404);
    });

    it('should fail with other user expense', async () => {
      const res = await request(app)
        .put(`/api/expenses/${expenseId}`)
        .set('x-auth-token', otherToken)
        .send({
          amount: 200,
          category: categoryId,
          description: 'Updated Groceries'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    beforeEach(async () => {
      const expenseRes = await request(app)
        .post('/api/expenses')
        .set('x-auth-token', token)
        .send({
          amount: 100,
          category: categoryId,
          description: 'Groceries'
        });
      expenseId = expenseRes.body._id;
    });

    it('should delete expense', async () => {
      const res = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe('Expense removed');

      const getRes = await request(app)
        .get('/api/expenses')
        .set('x-auth-token', token);
      expect(getRes.body.length).toBe(0);
    });

    it('should fail with non-existent expense', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/expenses/${fakeId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });

    it('should fail with other user expense', async () => {
      const res = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set('x-auth-token', otherToken);

      expect(res.status).toBe(401);
    });
  });
});