import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './entity/workshop.entity';
import { WorkshopController } from './workshop.controller';
import { WorkshopService } from './workshop.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop])],
  controllers: [WorkshopController],
  providers: [WorkshopService],
  exports: [WorkshopService, TypeOrmModule],
})
export class WorkshopModule {}

