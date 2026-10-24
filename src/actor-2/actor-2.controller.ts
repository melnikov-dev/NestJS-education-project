import { Body, Controller, Post } from '@nestjs/common';
import { Actor2Service } from './actor-2.service.js';
import { CreateActor2Dto } from './dto/create-actor-2.dto.js';

@Controller('actors-2')
export class Actor2Controller {
  constructor(private readonly actorService: Actor2Service) {}

  @Post()
  create(@Body() dto: CreateActor2Dto) {
    return this.actorService.create(dto);
  }
}
