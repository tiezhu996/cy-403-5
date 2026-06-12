import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  bookingId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}

