import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtRequestUser } from '../../common/middlewares/auth.middleware';
import { Booking } from '../booking/entity/booking.entity';
import { Workshop } from '../workshop/entity/workshop.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Workshop) private readonly workshopRepo: Repository<Workshop>,
  ) {}

  findAll(query: { courseId?: string; workshopId?: string }) {
    const qb = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.student', 'student')
      .leftJoinAndSelect('review.course', 'course')
      .leftJoinAndSelect('course.workshop', 'workshop')
      .orderBy('review.createdAt', 'DESC');

    if (query.courseId) {
      qb.andWhere('review.courseId = :courseId', { courseId: Number(query.courseId) });
    }
    if (query.workshopId) {
      qb.andWhere('course.workshopId = :workshopId', { workshopId: Number(query.workshopId) });
    }

    return qb.getMany();
  }

  async create(dto: CreateReviewDto, user: JwtRequestUser) {
    const booking = await this.bookingRepo.findOne({
      where: { id: dto.bookingId },
      relations: ['course', 'course.workshop'],
    });
    if (!booking) {
      throw new NotFoundException('预约不存在');
    }
    if (booking.studentId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('只能评价自己的预约');
    }
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('完成体验后才能评价');
    }

    const existing = await this.reviewRepo.findOneBy({ bookingId: booking.id });
    if (existing) {
      throw new BadRequestException('该预约已评价');
    }

    const review = await this.reviewRepo.save(
      this.reviewRepo.create({
        bookingId: booking.id,
        courseId: booking.courseId,
        studentId: user.id,
        rating: dto.rating,
        content: dto.content,
        images: dto.images ?? [],
      }),
    );

    await this.refreshWorkshopRating(booking.courseId);
    return review;
  }

  async remove(id: number, user: JwtRequestUser) {
    const review = await this.reviewRepo.findOne({ where: { id }, relations: ['course'] });
    if (!review) {
      throw new NotFoundException('评价不存在');
    }
    if (user.role !== UserRole.ADMIN && review.studentId !== user.id) {
      throw new ForbiddenException('无权删除该评价');
    }
    await this.reviewRepo.remove(review);
    await this.refreshWorkshopRating(review.course.workshopId);
    return { deleted: true };
  }

  private async refreshWorkshopRating(workshopId: number) {
    const rows = await this.reviewRepo
      .createQueryBuilder('review')
      .leftJoin('review.course', 'course')
      .where('course.workshopId = :workshopId', { workshopId })
      .select('AVG(review.rating)', 'avg')
      .getRawOne<{ avg: string }>();
    const workshop = await this.workshopRepo.findOneBy({ id: workshopId });
    if (workshop) {
      workshop.rating = Number(Number(rows?.avg ?? 0).toFixed(2));
      await this.workshopRepo.save(workshop);
    }
  }
}
