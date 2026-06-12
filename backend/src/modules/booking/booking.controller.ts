import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
@UseGuards(RoleGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
  create(@Body() dto: CreateBookingDto, @Req() req: any) {
    return this.bookingService.create(dto, req.user);
  }

  @Get('my')
  findMy(@Req() req: any, @Query('status') status?: BookingStatus) {
    return this.bookingService.findMy(req.user.id, status);
  }

  @Get('instructor')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  findInstructorBookings(@Req() req: any) {
    return this.bookingService.findInstructorBookings(req.user.id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto, @Req() req: any) {
    return this.bookingService.updateStatus(Number(id), dto.status, req.user);
  }

  @Patch(':id/check-in')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  checkIn(@Param('id') id: string, @Req() req: any) {
    return this.bookingService.checkIn(Number(id), req.user);
  }
}

