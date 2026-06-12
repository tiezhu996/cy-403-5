import * as bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { WorkshopStatus } from '../common/enums/workshop-status.enum';
import { WorkshopTag } from '../common/enums/workshop-tag.enum';
import { Booking } from '../modules/booking/entity/booking.entity';
import { Course } from '../modules/course/entity/course.entity';
import { Review } from '../modules/review/entity/review.entity';
import { User } from '../modules/user/entity/user.entity';
import { Workshop } from '../modules/workshop/entity/workshop.entity';
import { createBookingNo } from './id.util';

export async function seedDemoData(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  if ((await userRepo.count()) > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash('demo123', 10);
  const instructor = await userRepo.save(
    userRepo.create({
      name: '林青岚',
      phone: '13800000001',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
      role: UserRole.INSTRUCTOR,
      bio: '省级非遗扎染传承人，长期开展植物染课程。',
      passwordHash,
    }),
  );
  const student = await userRepo.save(
    userRepo.create({
      name: '陈小满',
      phone: '13800000002',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=320&q=80',
      role: UserRole.STUDENT,
      bio: '传统手作爱好者。',
      passwordHash,
    }),
  );
  await userRepo.save(
    userRepo.create({
      name: '平台管理员',
      phone: '13800000003',
      role: UserRole.ADMIN,
      bio: '负责工坊审核与评价治理。',
      passwordHash,
    }),
  );

  const workshopRepo = dataSource.getRepository(Workshop);
  const tieDye = await workshopRepo.save(
    workshopRepo.create({
      name: '青蓝草木染工坊',
      description: '以天然蓝靛和本地植物染为核心，提供扎染、蜡染和布艺再造体验。',
      address: '杭州市西湖区转塘街道艺创小镇 18 号',
      coverImage: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80',
      tags: [WorkshopTag.TIE_DYE, WorkshopTag.EMBROIDERY],
      status: WorkshopStatus.OPEN,
      rating: 4.8,
      instructorId: instructor.id,
    }),
  );
  const pottery = await workshopRepo.save(
    workshopRepo.create({
      name: '云窑陶艺研习社',
      description: '围绕拉坯、修坯、釉色实验和窑烧工艺，适合零基础学员入门。',
      address: '景德镇市珠山区陶溪川路 6 号',
      coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
      tags: [WorkshopTag.POTTERY, WorkshopTag.LACQUER],
      status: WorkshopStatus.OPEN,
      rating: 4.6,
      instructorId: instructor.id,
    }),
  );

  const courseRepo = dataSource.getRepository(Course);
  const course = await courseRepo.save(
    courseRepo.create({
      title: '蓝染方巾体验课',
      description: '学习扎结、浸染、氧化和清洗流程，完成一条可带走的蓝染方巾。',
      durationHours: 2,
      price: 168,
      maxParticipants: 8,
      workshopId: tieDye.id,
      instructorId: instructor.id,
      scheduleRule: { weekdays: [2, 4, 6], slots: ['10:00-12:00', '14:00-16:00'] },
      coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
    }),
  );
  await courseRepo.save(
    courseRepo.create({
      title: '手捏陶杯入门',
      description: '从泥料认识到造型完成，体验陶土的可塑性与手作节奏。',
      durationHours: 2.5,
      price: 198,
      maxParticipants: 10,
      workshopId: pottery.id,
      instructorId: instructor.id,
      scheduleRule: { weekdays: [1, 3, 5], slots: ['09:30-12:00', '15:00-17:30'] },
      coverImage: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80',
    }),
  );

  const bookingRepo = dataSource.getRepository(Booking);
  const booking = await bookingRepo.save(
    bookingRepo.create({
      bookingNo: createBookingNo(),
      courseId: course.id,
      studentId: student.id,
      bookingDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      timeSlot: '14:00-16:00',
      peopleCount: 2,
      status: BookingStatus.COMPLETED,
      remark: '希望安排靠近染缸的位置。',
    }),
  );

  await dataSource.getRepository(Review).save(
    dataSource.getRepository(Review).create({
      bookingId: booking.id,
      studentId: student.id,
      courseId: course.id,
      rating: 5,
      content: '老师讲得很细，染色过程很有仪式感，成品颜色也很稳定。',
      images: ['https://images.unsplash.com/photo-1534889156217-d643df14f14a?auto=format&fit=crop&w=600&q=80'],
    }),
  );
}
