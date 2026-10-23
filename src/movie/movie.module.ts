import { Module } from '@nestjs/common';
import { MovieService } from './movie.service.js';
import { MovieController } from './movie.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity.js';
import { ActorEntity } from '../actor/entities/actor.entity.js';
import { ActorModule } from '../actor/actor.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), ActorModule],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService]
})
export class MovieModule { }
