describe('Validation Middleware', () => {
  const { registerValidation, loginValidation, bookingValidation, paymentValidation } = require('../middleware/validation');

  test('validation middleware functions are defined', () => {
    expect(registerValidation).toBeDefined();
    expect(Array.isArray(registerValidation)).toBe(true);
    expect(loginValidation).toBeDefined();
    expect(Array.isArray(loginValidation)).toBe(true);
    expect(bookingValidation).toBeDefined();
    expect(Array.isArray(bookingValidation)).toBe(true);
    expect(paymentValidation).toBeDefined();
    expect(Array.isArray(paymentValidation)).toBe(true);
  });
});

describe('Auth Middleware', () => {
  const { authorize } = require('../middleware/auth');

  test('authorize returns a middleware function', () => {
    const middleware = authorize('admin');
    expect(typeof middleware).toBe('function');
  });

  test('authorize accepts multiple roles', () => {
    const middleware = authorize('admin', 'provider');
    expect(typeof middleware).toBe('function');
  });
});
