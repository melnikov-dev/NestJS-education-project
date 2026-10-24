import { Module } from '@nestjs/common';
import { Movie2Module } from '../movie-2/movie-2.module.js';
import { Review2Controller } from './review-2.controller.js';
import { Review2Service } from './review-2.service.js';

@Module({
  imports: [Movie2Module],
  controllers: [Review2Controller],
  providers: [Review2Service],
})
export class Review2Module {}
