const request = require('supertest');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Create a minimal test app without database
const createTestApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Test endpoint
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  // Auth validation
  const { body, validationResult } = require('express-validator');

  app.post('/api/auth/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    res.status(201).json({ success: true, message: 'Registration successful' });
  });

  app.post('/api/auth/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    res.json({ success: true, message: 'Login successful' });
  });

  // 404
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  return app;
};

describe('API Health Check', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });

  test('GET /api/test returns server running message', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Server is running!');
  });
});

describe('Auth Validation', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test('POST /api/auth/register fails without name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register fails with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'invalid', password: '123456' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register fails with short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register succeeds with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/login fails without email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: '123456' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login succeeds with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('404 Handler', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test('Non-existent route returns 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
