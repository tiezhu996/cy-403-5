import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entity/course.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entity/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Course])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}

