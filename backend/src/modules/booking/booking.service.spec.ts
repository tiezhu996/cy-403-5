import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtRequestUser } from '../../common/middlewares/auth.middleware';

describe('BookingService - checkIn', () => {
  let service: BookingService;
  let bookingRepo: any;
  let courseRepo: any;

  const instructorUser: JwtRequestUser = {
    id: 1,
    phone: '13800000001',
    name: '传承人',
    role: UserRole.INSTRUCTOR,
  };

  const adminUser: JwtRequestUser = {
    id: 3,
    phone: '13800000003',
    name: '管理员',
    role: UserRole.ADMIN,
  };

  const studentUser: JwtRequestUser = {
    id: 2,
    phone: '13800000002',
    name: '学员',
    role: UserRole.STUDENT,
  };

  beforeEach(() => {
    bookingRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    courseRepo = {};
    service = new BookingService(bookingRepo, courseRepo);
  });

  it('should allow instructor who owns the course to check in', async () => {
    const booking = {
      id: 10,
      status: BookingStatus.CONFIRMED,
      course: { instructorId: 1 },
    };
    bookingRepo.findOne.mockResolvedValue(booking);
    bookingRepo.save.mockImplementation((b: any) => Promise.resolve(b));

    const result = await service.checkIn(10, instructorUser);

    expect(result.status).toBe(BookingStatus.COMPLETED);
    expect(bookingRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: BookingStatus.COMPLETED }),
    );
  });

  it('should allow admin to check in', async () => {
    const booking = {
      id: 10,
      status: BookingStatus.CONFIRMED,
      course: { instructorId: 1 },
    };
    bookingRepo.findOne.mockResolvedValue(booking);
    bookingRepo.save.mockImplementation((b: any) => Promise.resolve(b));

    const result = await service.checkIn(10, adminUser);

    expect(result.status).toBe(BookingStatus.COMPLETED);
  });

  it('should throw ForbiddenException if user is not the course instructor or admin', async () => {
    const booking = {
      id: 10,
      status: BookingStatus.CONFIRMED,
      course: { instructorId: 1 },
    };
    bookingRepo.findOne.mockResolvedValue(booking);

    await expect(service.checkIn(10, studentUser)).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if another instructor tries to check in', async () => {
    const otherInstructor: JwtRequestUser = {
      id: 99,
      phone: '13800000099',
      name: '其他传承人',
      role: UserRole.INSTRUCTOR,
    };
    const booking = {
      id: 10,
      status: BookingStatus.CONFIRMED,
      course: { instructorId: 1 },
    };
    bookingRepo.findOne.mockResolvedValue(booking);

    await expect(service.checkIn(10, otherInstructor)).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if booking does not exist', async () => {
    bookingRepo.findOne.mockResolvedValue(null);

    await expect(service.checkIn(999, instructorUser)).rejects.toThrow(NotFoundException);
  });
});

describe('RoleGuard', () => {
  let guard: any;
  let reflector: any;

  beforeEach(() => {
    const { RoleGuard } = require('../auth/guard/role.guard');
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RoleGuard(reflector);
  });

  function createMockExecutionContext(user?: JwtRequestUser, roles?: UserRole[]) {
    const request = { user };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    };
  }

  it('should throw UnauthorizedException if no user on request', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = createMockExecutionContext(undefined);

    expect(() => guard.canActivate(ctx)).toThrow('请先登录');
  });

  it('should allow access if user exists and no roles required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const user: JwtRequestUser = { id: 1, phone: '13800000001', name: '传承人', role: UserRole.INSTRUCTOR };
    const ctx = createMockExecutionContext(user);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow access if user role matches required role', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.INSTRUCTOR]);
    const user: JwtRequestUser = { id: 1, phone: '13800000001', name: '传承人', role: UserRole.INSTRUCTOR };
    const ctx = createMockExecutionContext(user);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should throw ForbiddenException if user role does not match', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.INSTRUCTOR]);
    const user: JwtRequestUser = { id: 2, phone: '13800000002', name: '学员', role: UserRole.STUDENT };
    const ctx = createMockExecutionContext(user);

    expect(() => guard.canActivate(ctx)).toThrow('当前角色无权执行该操作');
  });
});
