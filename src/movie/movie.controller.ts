import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { MovieService } from './movie.service.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto..js';
import { StringToLowercasePipe } from '../common/pipes/string-to-lowercase.pipe.js';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @Get()
  async findAll() {
    return this.movieService.findAll()
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.movieService.findById(Number(id))
  }

  @UsePipes(StringToLowercasePipe)
  @Post()
  async create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto)
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.movieService.update(Number(id), dto)
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.movieService.delete(Number(id))
  }

}
