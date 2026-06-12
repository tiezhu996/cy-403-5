import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { UserRole } from '../../common/enums/user-role.enum';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { seedDemoData } from '../../utils/seed-data';
import { User } from '../../modules/user/entity/user.entity';

process.env.JWT_SECRET = 'dev_secret';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '38103';
process.env.DB_USER = 'heritage';
process.env.DB_PASSWORD = 'heritage_pwd';
process.env.DB_NAME = 'heritage';
process.env.TYPEORM_SYNC = 'true';

describe('Booking Flow (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let studentToken: string;
  let instructorToken: string;
  let courseId: number;
  let bookingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository(User);
    if ((await userRepo.count()) === 0) {
      await seedDemoData(dataSource);
    }

    const loginResp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ phone: '13800000002', password: 'demo123' });
    if (loginResp.statusCode !== 201) {
      console.error('Login failed:', loginResp.body);
    }
    studentToken = loginResp.body.accessToken;

    const insLoginResp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ phone: '13800000001', password: 'demo123' });
    instructorToken = insLoginResp.body.accessToken;

    const workshopsResp = await request(app.getHttpServer()).get('/workshops');
    const workshops = workshopsResp.body;
    if (!Array.isArray(workshops) || workshops.length === 0) {
      console.error('No workshops found. Body:', workshops);
      throw new Error('Seed data not loaded');
    }
    const workshop = workshops.find((w: any) => w.instructorId === 1) || workshops[0];
    const workshopDetail = await request(app.getHttpServer()).get(`/workshops/${workshop.id}`);
    if (!workshopDetail.body.courses || workshopDetail.body.courses.length === 0) {
      console.error('No courses found for workshop:', workshopDetail.body);
      throw new Error('No courses available');
    }
    courseId = workshopDetail.body.courses[0].id;
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  it('should login successfully and return accessToken', () => {
    expect(studentToken).toBeDefined();
    expect(studentToken.length).toBeGreaterThan(10);
  });

  it('should return 401 when creating booking without token', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        courseId,
        bookingDate: '2026-06-15',
        timeSlot: '10:00-12:00',
        peopleCount: 2,
      });
    expect(response.status).toBe(401);
  });

  it('should create booking successfully with valid token', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId,
        bookingDate: '2026-06-15',
        timeSlot: '10:00-12:00',
        peopleCount: 2,
        remark: '第一次体验，请多多关照',
      });
    expect(response.status).toBe(201);
    expect(response.body.bookingNo).toBeDefined();
    expect(response.body.bookingNo.startsWith('BK')).toBe(true);
    expect(response.body.status).toBe(BookingStatus.PENDING);
    expect(response.body.peopleCount).toBe(2);
    expect(response.body.courseId).toBe(courseId);
    bookingId = response.body.id;
  }, 10000);

  it('should generate unique bookingNo each time', async () => {
    const b1 = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId,
        bookingDate: '2026-06-16',
        timeSlot: '14:00-16:00',
        peopleCount: 1,
      });
    const b2 = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId,
        bookingDate: '2026-06-16',
        timeSlot: '14:00-16:00',
        peopleCount: 1,
      });
    expect(b1.body.bookingNo).not.toBe(b2.body.bookingNo);
  }, 10000);

  it('should query my bookings and return the created booking', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings/my')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const myBooking = response.body.find((b: any) => b.id === bookingId);
    expect(myBooking).toBeDefined();
    expect(myBooking.status).toBe(BookingStatus.PENDING);
    expect(myBooking.bookingDate).toBe('2026-06-15');
    expect(myBooking.timeSlot).toBe('10:00-12:00');
  });

  it('should query instructor bookings with CONFIRMED status', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings/instructor')
      .set('Authorization', `Bearer ${instructorToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const pendingBookings = response.body.filter(
      (b: any) => b.status !== BookingStatus.COMPLETED,
    );
    expect(pendingBookings.length).toBeGreaterThan(0);
  });

  it('should check in a booking as instructor', async () => {
    const confirmedBookings = await request(app.getHttpServer())
      .get('/bookings/instructor')
      .set('Authorization', `Bearer ${instructorToken}`);
    const targetBooking = confirmedBookings.body.find(
      (b: any) => b.status === BookingStatus.CONFIRMED,
    );
    expect(targetBooking).toBeDefined();
    const checkInResponse = await request(app.getHttpServer())
      .patch(`/bookings/${targetBooking.id}/check-in`)
      .set('Authorization', `Bearer ${instructorToken}`);
    expect(checkInResponse.status).toBe(200);
    expect(checkInResponse.body.status).toBe(BookingStatus.COMPLETED);
  }, 10000);

  it('should return 403 when student tries to check in', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/check-in`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(403);
  });

  it('should return 401 when checking in without token', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/check-in`);
    expect(response.status).toBe(401);
  });

  it('should update booking status to CONFIRMED and query shows updated status', async () => {
    const updateResponse = await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ status: BookingStatus.CONFIRMED });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe(BookingStatus.CONFIRMED);

    const queryResponse = await request(app.getHttpServer())
      .get('/bookings/my')
      .set('Authorization', `Bearer ${studentToken}`);
    const updated = queryResponse.body.find((b: any) => b.id === bookingId);
    expect(updated.status).toBe(BookingStatus.CONFIRMED);
  }, 10000);

  it('should complete the full flow: create → confirm → check-in', async () => {
    const create = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId,
        bookingDate: '2026-06-20',
        timeSlot: '14:00-16:00',
        peopleCount: 4,
      });
    expect(create.body.status).toBe(BookingStatus.PENDING);
    const newBookingId = create.body.id;

    const confirm = await request(app.getHttpServer())
      .patch(`/bookings/${newBookingId}/status`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ status: BookingStatus.CONFIRMED });
    expect(confirm.body.status).toBe(BookingStatus.CONFIRMED);

    const checkIn = await request(app.getHttpServer())
      .patch(`/bookings/${newBookingId}/check-in`)
      .set('Authorization', `Bearer ${instructorToken}`);
    expect(checkIn.body.status).toBe(BookingStatus.COMPLETED);

    const verify = await request(app.getHttpServer())
      .get('/bookings/my')
      .set('Authorization', `Bearer ${studentToken}`);
    const finalBooking = verify.body.find((b: any) => b.id === newBookingId);
    expect(finalBooking.status).toBe(BookingStatus.COMPLETED);
  }, 15000);
});
