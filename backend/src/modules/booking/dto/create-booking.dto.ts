import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  courseId: number;

  @IsDateString()
  bookingDate: string;

  @IsString()
  timeSlot: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  peopleCount: number;

  @IsOptional()
  @IsString()
  remark?: string;
}

