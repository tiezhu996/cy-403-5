import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtRequestUser } from '../../common/middlewares/auth.middleware';
import { createBookingNo } from '../../utils/id.util';
import { Course } from '../course/entity/course.entity';
import { Booking } from './entity/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
  ) {}

  async create(dto: CreateBookingDto, user: JwtRequestUser) {
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId }, relations: ['workshop'] });
    if (!course) {
      throw new NotFoundException('课程不存在');
    }

    const booked = await this.bookingRepo.sum('peopleCount', {
      courseId: dto.courseId,
      bookingDate: dto.bookingDate,
      timeSlot: dto.timeSlot,
      status: BookingStatus.PENDING,
    });
    if ((booked ?? 0) + dto.peopleCount > course.maxParticipants) {
      throw new BadRequestException('该时段余位不足');
    }

    return this.bookingRepo.save(
      this.bookingRepo.create({
        ...dto,
        bookingNo: createBookingNo(),
        studentId: user.id,
        status: BookingStatus.PENDING,
      }),
    );
  }

  findMy(userId: number, status?: BookingStatus) {
    return this.bookingRepo.find({
      where: { studentId: userId, ...(status ? { status } : {}) },
      relations: ['course', 'course.workshop', 'student', 'review'],
      order: { createdAt: 'DESC' },
    });
  }

  findInstructorBookings(userId: number) {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.course', 'course')
      .leftJoinAndSelect('course.workshop', 'workshop')
      .leftJoinAndSelect('booking.student', 'student')
      .where('course.instructorId = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC')
      .getMany();
  }

  async updateStatus(id: number, status: BookingStatus, user: JwtRequestUser) {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['course'] });
    if (!booking) {
      throw new NotFoundException('预约不存在');
    }
    const ownsBooking = booking.studentId === user.id;
    const ownsCourse = booking.course.instructorId === user.id;
    if (user.role !== UserRole.ADMIN && !ownsBooking && !ownsCourse) {
      throw new ForbiddenException('无权修改该预约');
    }
    if (ownsBooking && status !== BookingStatus.CANCELLED && user.role === UserRole.STUDENT) {
      throw new ForbiddenException('学员仅可取消自己的预约');
    }
    booking.status = status;
    return this.bookingRepo.save(booking);
  }

  async checkIn(id: number, user: JwtRequestUser) {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['course'] });
    if (!booking) {
      throw new NotFoundException('预约不存在');
    }
    if (user.role !== UserRole.ADMIN && booking.course.instructorId !== user.id) {
      throw new ForbiddenException('只有课程导师可签到');
    }
    booking.status = BookingStatus.COMPLETED;
    return this.bookingRepo.save(booking);
  }
}
