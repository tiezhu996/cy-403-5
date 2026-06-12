import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { Course } from '../../course/entity/course.entity';
import { Review } from '../../review/entity/review.entity';
import { User } from '../../user/entity/user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 32 })
  bookingNo: string;

  @ManyToOne(() => Course, (course) => course.bookings)
  course: Course;

  @Column()
  courseId: number;

  @ManyToOne(() => User, (user) => user.bookings)
  student: User;

  @Column()
  studentId: number;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ length: 30 })
  timeSlot: string;

  @Column({ default: 1 })
  peopleCount: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @OneToOne(() => Review, (review) => review.booking)
  review: Review;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

