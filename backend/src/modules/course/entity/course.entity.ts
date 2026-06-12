import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from '../../booking/entity/booking.entity';
import { Review } from '../../review/entity/review.entity';
import { User } from '../../user/entity/user.entity';
import { Workshop } from '../../workshop/entity/workshop.entity';

export interface CourseScheduleRule {
  weekdays: number[];
  slots: string[];
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 1, transformer: { to: (value: number) => value, from: (value: string) => Number(value) } })
  durationHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => Number(value) } })
  price: number;

  @Column({ default: 8 })
  maxParticipants: number;

  @Column({ type: 'simple-json' })
  scheduleRule: CourseScheduleRule;

  @Column()
  coverImage: string;

  @ManyToOne(() => Workshop, (workshop) => workshop.courses, { onDelete: 'CASCADE' })
  workshop: Workshop;

  @Column()
  workshopId: number;

  @ManyToOne(() => User, (user) => user.courses)
  instructor: User;

  @Column()
  instructorId: number;

  @OneToMany(() => Booking, (booking) => booking.course)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

