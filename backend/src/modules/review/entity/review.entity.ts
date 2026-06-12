import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from '../../booking/entity/booking.entity';
import { Course } from '../../course/entity/course.entity';
import { User } from '../../user/entity/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @OneToOne(() => Booking, (booking) => booking.review, { onDelete: 'CASCADE' })
  @JoinColumn()
  booking: Booking;

  @Column()
  bookingId: number;

  @ManyToOne(() => User, (user) => user.reviews)
  student: User;

  @Column()
  studentId: number;

  @ManyToOne(() => Course, (course) => course.reviews)
  course: Course;

  @Column()
  courseId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
