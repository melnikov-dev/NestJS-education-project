import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateMovie2Dto } from './dto/create-movie-2.dto.js';
import { UpdateMovie2Dto } from './dto/update-movie-2.dto.js';
import { Movie2Service } from './movie-2.service.js';

@Controller('movies-2')
export class Movie2Controller {
  constructor(private readonly movieService: Movie2Service) {}

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.movieService.findById(Number(id));
  }

  @Post()
  create(@Body() dto: CreateMovie2Dto) {
    return this.movieService.create(dto);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() dto: UpdateMovie2Dto) {
    return this.movieService.update(Number(id), dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.movieService.delete(Number(id));
  }
}
