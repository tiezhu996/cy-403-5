import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import { WorkshopStatus } from '../../common/enums/workshop-status.enum';
import { WorkshopTag } from '../../common/enums/workshop-tag.enum';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { WorkshopService } from './workshop.service';

@Controller('workshops')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get()
  findAll(@Query() query: { tag?: WorkshopTag; minRating?: string; district?: string }) {
    return this.workshopService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workshopService.findOne(Number(id));
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  create(@Body() dto: CreateWorkshopDto) {
    return this.workshopService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateWorkshopDto) {
    return this.workshopService.update(Number(id), dto);
  }

  @Patch(':id/status')
  @UseGuards(RoleGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body('status') status: WorkshopStatus) {
    return this.workshopService.updateStatus(Number(id), status);
  }
}

