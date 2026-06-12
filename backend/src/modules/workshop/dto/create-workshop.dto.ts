import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { WorkshopStatus } from '../../../common/enums/workshop-status.enum';
import { WorkshopTag } from '../../../common/enums/workshop-tag.enum';

export class CreateWorkshopDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsString()
  coverImage: string;

  @IsArray()
  @IsEnum(WorkshopTag, { each: true })
  tags: WorkshopTag[];

  @IsNumber()
  instructorId: number;

  @IsOptional()
  @IsEnum(WorkshopStatus)
  status?: WorkshopStatus;
}

