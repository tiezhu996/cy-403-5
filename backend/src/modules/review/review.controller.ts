import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  findAll(@Query() query: { courseId?: string; workshopId?: string }) {
    return this.reviewService.findAll(query);
  }

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() dto: CreateReviewDto, @Req() req: any) {
    return this.reviewService.create(dto, req.user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.reviewService.remove(Number(id), req.user);
  }
}

