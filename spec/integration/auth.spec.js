const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@test.com',
          password: 'password123'
        });

      // Duplicate registration
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Another User',
          email: 'test@test.com',
          password: 'password456'
        });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('User already exists');
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User'
        });

      expect(res.status).toBe(400);
    });

    it('should fail with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@test.com',
          password: 'password123'
        });
    });

    it('should login existing user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('Invalid credentials');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('Invalid credentials');
    });

    it('should fail with missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
    });
  });
});