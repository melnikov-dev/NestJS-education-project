import { Injectable } from '@nestjs/common';
import { Poster2 } from '@prisma/client';
import { Movie2Service } from '../movie-2/movie-2.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePoster2Dto } from './dto/create-poster-2.dto.js';

@Injectable()
export class Poster2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movieService: Movie2Service,
  ) {}

  async create(dto: CreatePoster2Dto): Promise<Poster2> {
    await this.movieService.findById(dto.movieId);

    return this.prisma.poster2.create({
      data: {
        url: dto.url,
        movieId: dto.movieId,
      },
    });
  }
}
