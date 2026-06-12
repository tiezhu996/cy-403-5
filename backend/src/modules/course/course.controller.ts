import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll(@Query() query: { workshopId?: string }) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(Number(id));
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(Number(id), dto);
  }
}

