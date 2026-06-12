import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Booking } from '../modules/booking/entity/booking.entity';
import { Course } from '../modules/course/entity/course.entity';
import { Review } from '../modules/review/entity/review.entity';
import { User } from '../modules/user/entity/user.entity';
import { Workshop } from '../modules/workshop/entity/workshop.entity';

export function createTypeOrmOptions(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: Number(config.get<string>('DB_PORT', '38103')),
    username: config.get<string>('DB_USER', 'heritage'),
    password: config.get<string>('DB_PASSWORD', 'heritage_pwd'),
    database: config.get<string>('DB_NAME', 'heritage'),
    entities: [User, Workshop, Course, Booking, Review],
    synchronize: config.get<string>('TYPEORM_SYNC', 'true') !== 'false',
    charset: 'utf8mb4',
  };
}

