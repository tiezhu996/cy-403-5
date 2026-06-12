import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entity/course.entity';

@Injectable()
export class CourseService {
  constructor(@InjectRepository(Course) private readonly courseRepo: Repository<Course>) {}

  findAll(query: { workshopId?: string }) {
    const where = query.workshopId ? { workshopId: Number(query.workshopId) } : {};
    return this.courseRepo.find({
      where,
      relations: ['workshop', 'instructor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['workshop', 'instructor', 'reviews', 'reviews.student'],
    });
    if (!course) {
      throw new NotFoundException('课程不存在');
    }
    return course;
  }

  create(dto: CreateCourseDto) {
    return this.courseRepo.save(this.courseRepo.create(dto));
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.findOne(id);
    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }
}

