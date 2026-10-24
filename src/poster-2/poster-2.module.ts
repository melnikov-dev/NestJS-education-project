import { Module } from '@nestjs/common';
import { Movie2Module } from '../movie-2/movie-2.module.js';
import { Poster2Controller } from './poster-2.controller.js';
import { Poster2Service } from './poster-2.service.js';

@Module({
  imports: [Movie2Module],
  controllers: [Poster2Controller],
  providers: [Poster2Service],
})
export class Poster2Module {}
