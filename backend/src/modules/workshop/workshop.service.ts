import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkshopStatus } from '../../common/enums/workshop-status.enum';
import { WorkshopTag } from '../../common/enums/workshop-tag.enum';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { Workshop } from './entity/workshop.entity';

@Injectable()
export class WorkshopService {
  constructor(@InjectRepository(Workshop) private readonly workshopRepo: Repository<Workshop>) {}

  findAll(query: { tag?: WorkshopTag; minRating?: string; district?: string }) {
    const qb = this.workshopRepo
      .createQueryBuilder('workshop')
      .leftJoinAndSelect('workshop.instructor', 'instructor')
      .orderBy('workshop.rating', 'DESC');

    if (query.tag) {
      qb.andWhere('workshop.tags LIKE :tag', { tag: `%${query.tag}%` });
    }
    if (query.minRating) {
      qb.andWhere('workshop.rating >= :minRating', { minRating: Number(query.minRating) });
    }
    if (query.district) {
      qb.andWhere('workshop.address LIKE :district', { district: `%${query.district}%` });
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const workshop = await this.workshopRepo.findOne({
      where: { id },
      relations: ['instructor', 'courses', 'courses.instructor'],
    });
    if (!workshop) {
      throw new NotFoundException('工坊不存在');
    }
    return workshop;
  }

  create(dto: CreateWorkshopDto) {
    return this.workshopRepo.save(this.workshopRepo.create(dto));
  }

  async update(id: number, dto: UpdateWorkshopDto) {
    const workshop = await this.findOne(id);
    Object.assign(workshop, dto);
    return this.workshopRepo.save(workshop);
  }

  async updateStatus(id: number, status: WorkshopStatus) {
    const workshop = await this.findOne(id);
    workshop.status = status;
    return this.workshopRepo.save(workshop);
  }
}
