import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { createTypeOrmOptions } from './config/database.config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { CourseModule } from './modules/course/course.module';
import { ReviewModule } from './modules/review/review.module';
import { UserModule } from './modules/user/user.module';
import { WorkshopModule } from './modules/workshop/workshop.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../.env', '.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createTypeOrmOptions,
    }),
    AuthModule,
    UserModule,
    WorkshopModule,
    CourseModule,
    BookingModule,
    ReviewModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware, AuthMiddleware).forRoutes('*');
  }
}

