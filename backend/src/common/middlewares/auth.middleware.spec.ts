import * as jwt from 'jsonwebtoken';
import { AuthMiddleware, JwtRequestUser } from './auth.middleware';
import { UserRole } from '../enums/user-role.enum';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  const secret = 'dev_secret';

  beforeEach(() => {
    middleware = new AuthMiddleware();
  });

  function createMockRequest(authHeader?: string) {
    return {
      headers: { authorization: authHeader },
    } as any;
  }

  function createMockResponse() {
    return {} as any;
  }

  it('should set req.user when valid Bearer token is provided', () => {
    const payload = { sub: 1, phone: '13800000001', name: '传承人', role: UserRole.INSTRUCTOR };
    const token = jwt.sign(payload, secret);
    const req = createMockRequest(`Bearer ${token}`);
    const res = createMockResponse();
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user!.id).toBe(1);
    expect(req.user!.phone).toBe('13800000001');
    expect(req.user!.name).toBe('传承人');
    expect(req.user!.role).toBe(UserRole.INSTRUCTOR);
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user to undefined when no Authorization header', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user to undefined when token is invalid', () => {
    const req = createMockRequest('Bearer invalid.token.here');
    const res = createMockResponse();
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user to undefined when Authorization header does not start with Bearer', () => {
    const payload = { sub: 1, phone: '13800000001', name: '传承人', role: UserRole.INSTRUCTOR };
    const token = jwt.sign(payload, secret);
    const req = createMockRequest(`Token ${token}`);
    const res = createMockResponse();
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should correctly parse sub as numeric id', () => {
    const payload = { sub: 42, phone: '13800000003', name: '管理员', role: UserRole.ADMIN };
    const token = jwt.sign(payload, secret);
    const req = createMockRequest(`Bearer ${token}`);
    const res = createMockResponse();
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user!.id).toBe(42);
    expect(typeof req.user!.id).toBe('number');
  });

  it('should handle student role token', () => {
    const payload = { sub: 2, phone: '13800000002', name: '学员', role: UserRole.STUDENT };
    const token = jwt.sign(payload, secret);
    const req = createMockRequest(`Bearer ${token}`);
    const res = createMockResponse();
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user!.role).toBe(UserRole.STUDENT);
  });
});
