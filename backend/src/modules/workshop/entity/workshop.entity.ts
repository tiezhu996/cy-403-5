import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WorkshopStatus } from '../../../common/enums/workshop-status.enum';
import { WorkshopTag } from '../../../common/enums/workshop-tag.enum';
import { Course } from '../../course/entity/course.entity';
import { User } from '../../user/entity/user.entity';

@Entity('workshops')
export class Workshop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 160 })
  address: string;

  @Column()
  coverImage: string;

  @Column({ type: 'simple-json' })
  tags: WorkshopTag[];

  @Column({ type: 'enum', enum: WorkshopStatus, default: WorkshopStatus.OPEN })
  status: WorkshopStatus;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
    transformer: { to: (value: number) => value, from: (value: string) => Number(value) },
  })
  rating: number;

  @ManyToOne(() => User, (user) => user.workshops, { eager: false })
  instructor: User;

  @Column()
  instructorId: number;

  @OneToMany(() => Course, (course) => course.workshop)
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

