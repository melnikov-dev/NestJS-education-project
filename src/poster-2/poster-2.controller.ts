import { Body, Controller, Post } from '@nestjs/common';
import { CreatePoster2Dto } from './dto/create-poster-2.dto.js';
import { Poster2Service } from './poster-2.service.js';

@Controller('posters-2')
export class Poster2Controller {
  constructor(private readonly posterService: Poster2Service) {}

  @Post()
  create(@Body() dto: CreatePoster2Dto) {
    return this.posterService.create(dto);
  }
}
