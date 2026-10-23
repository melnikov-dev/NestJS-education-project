import { Module } from '@nestjs/common';
import { MovieService } from './movie.service.js';
import { MovieController } from './movie.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity.js';
import { ActorModule } from '../actor/actor.module.js';
import { MoviePosterEntity } from './entities/poster.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, MoviePosterEntity]), ActorModule],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService]
})
export class MovieModule { }
