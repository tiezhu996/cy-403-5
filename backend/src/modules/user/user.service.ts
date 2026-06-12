import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  findAll() {
    return this.userRepo.find({ select: ['id', 'name', 'phone', 'avatar', 'role', 'bio', 'createdAt', 'updatedAt'] });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'name', 'phone', 'avatar', 'role', 'bio', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);
    delete (saved as Partial<User>).passwordHash;
    return saved;
  }
}

