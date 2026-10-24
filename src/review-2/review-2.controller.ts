import { Body, Controller, Post } from '@nestjs/common';
import { CreateReview2Dto } from './dto/create-review-2.dto.js';
import { Review2Service } from './review-2.service.js';

@Controller('reviews-2')
export class Review2Controller {
  constructor(private readonly reviewService: Review2Service) {}

  @Post()
  create(@Body() dto: CreateReview2Dto) {
    return this.reviewService.create(dto);
  }
}
