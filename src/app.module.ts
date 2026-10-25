import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TaskModule } from './task/task.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/typeorm.config.js';
import { MovieModule } from './movie/movie.module.js';
import { ReviewModule } from './review/review.module.js';
import { ActorModule } from './actor/actor.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { Movie2Module } from './movie-2/movie-2.module.js';
import { Review2Module } from './review-2/review-2.module.js';
import { Actor2Module } from './actor-2/actor-2.module.js';
import { Poster2Module } from './poster-2/poster-2.module.js';
import { LoggerMiddleware } from './common/middlewares/logger.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    TaskModule,
    MovieModule,
    ReviewModule,
    ActorModule,
    Movie2Module,
    Review2Module,
    Actor2Module,
    Poster2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
