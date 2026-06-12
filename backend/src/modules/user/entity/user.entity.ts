import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Booking } from '../../booking/entity/booking.entity';
import { Course } from '../../course/entity/course.entity';
import { Review } from '../../review/entity/review.entity';
import { Workshop } from '../../workshop/entity/workshop.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ length: 120 })
  passwordHash: string;

  @OneToMany(() => Workshop, (workshop) => workshop.instructor)
  workshops: Workshop[];

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];

  @OneToMany(() => Booking, (booking) => booking.student)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.student)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

