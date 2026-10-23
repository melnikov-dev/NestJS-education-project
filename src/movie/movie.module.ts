import { Module } from '@nestjs/common';
import { MovieService } from './movie.service.js';
import { MovieController } from './movie.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule { }
