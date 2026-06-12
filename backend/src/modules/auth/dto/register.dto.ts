import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @Length(4, 40)
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

