import { Module } from '@nestjs/common';
import { Actor2Module } from '../actor-2/actor-2.module.js';
import { Movie2Controller } from './movie-2.controller.js';
import { Movie2Service } from './movie-2.service.js';

@Module({
  imports: [Actor2Module],
  controllers: [Movie2Controller],
  providers: [Movie2Service],
  exports: [Movie2Service],
})
export class Movie2Module {}
