const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

describe('Category API', () => {
  let token;
  let userId;
  let categoryId;

  beforeEach(async () => {
    // Clear categories collection
    await mongoose.connection.collection('categories').deleteMany({});

    // Create test user and get token
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });

    // Extract token and decode to get userId
    token = res.body.token;
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    userId = decoded.user.id;
  });

  describe('POST /api/categories', () => {
    it('should create new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({ name: 'Food' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Food');
      expect(res.body.user.toString()).toBe(userId);
    });

    it('should fail without name', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('Name is required');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Food' });

      expect(res.status).toBe(401);
      expect(res.body.msg).toBe('No token, authorization denied');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('x-auth-token', 'invalid-token')
        .send({ name: 'Food' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      // Create a test category
      const category = await request(app)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({ name: 'Food' });
      categoryId = category.body._id;
    });

    it('should get all categories', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].name).toBe('Food');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .get('/api/categories');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/categories/:id', () => {
    beforeEach(async () => {
      const category = await request(app)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({ name: 'Food' });
      categoryId = category.body._id;
    });

    it('should update category', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('x-auth-token', token)
        .send({ name: 'Updated Food' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Food');
    });

    it('should fail with non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/categories/${fakeId}`)
        .set('x-auth-token', token)
        .send({ name: 'Updated Food' });

      expect(res.status).toBe(404);
      expect(res.body.msg).toBe('Category not found');
    });

    it('should fail with other user category', async () => {
      // Create another user and get their token
      const otherUser = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Other User',
          email: 'other@test.com',
          password: 'password123'
        });

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('x-auth-token', otherUser.body.token)
        .send({ name: 'Updated Food' });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    beforeEach(async () => {
      const category = await request(app)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({ name: 'Food' });
      categoryId = category.body._id;
    });

    it('should delete category', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe('Category removed');

      // Verify category is deleted
      const getRes = await request(app)
        .get('/api/categories')
        .set('x-auth-token', token);
      expect(getRes.body.length).toBe(0);
    });

    it('should fail with non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/categories/${fakeId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });

    it('should fail with other user category', async () => {
      const otherUser = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Other User',
          email: 'other@test.com',
          password: 'password123'
        });

      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('x-auth-token', otherUser.body.token);

      expect(res.status).toBe(401);
    });
  });
});