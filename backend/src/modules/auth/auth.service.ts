import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../user/entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOneBy({ phone: dto.phone });
    if (existing) {
      throw new BadRequestException('手机号已注册');
    }
    const user = await this.userRepo.save(
      this.userRepo.create({
        name: dto.name,
        phone: dto.phone,
        avatar: dto.avatar,
        bio: dto.bio,
        role: dto.role ?? UserRole.STUDENT,
        passwordHash: await bcrypt.hash(dto.password, 10),
      }),
    );
    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ phone: dto.phone });
    if (!user) {
      throw new UnauthorizedException('手机号或密码错误');
    }
    const matched = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('手机号或密码错误');
    }
    return this.issueToken(user);
  }

  async me(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('登录已失效');
    }
    delete (user as Partial<User>).passwordHash;
    return user;
  }

  async switchRole(userId: number, role: UserRole) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('登录已失效');
    }
    user.role = role;
    await this.userRepo.save(user);
    return this.issueToken(user);
  }

  private issueToken(user: User) {
    const safeUser = { ...user };
    delete (safeUser as Partial<User>).passwordHash;
    const accessToken = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    });
    return { accessToken, user: safeUser };
  }
}
