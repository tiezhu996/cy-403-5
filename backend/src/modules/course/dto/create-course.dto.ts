import { IsArray, IsNumber, IsObject, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ScheduleRuleDto {
  @IsArray()
  weekdays: number[];

  @IsArray()
  slots: string[];
}

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0.5)
  @Max(12)
  durationHours: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @IsNumber()
  workshopId: number;

  @IsNumber()
  instructorId: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ScheduleRuleDto)
  scheduleRule: ScheduleRuleDto;

  @IsString()
  coverImage: string;
}

