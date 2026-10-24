import { Injectable } from '@nestjs/common';
import { Review2 } from '@prisma/client';
import { Movie2Service } from '../movie-2/movie-2.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReview2Dto } from './dto/create-review-2.dto.js';

@Injectable()
export class Review2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movieService: Movie2Service,
  ) {}

  async create(dto: CreateReview2Dto): Promise<Review2> {
    const movie = await this.movieService.findById(dto.movieId);

    return this.prisma.review2.create({
      data: {
        text: dto.text,
        rating: dto.rating,
        movie: { connect: { id: movie.id } },
      },
    });
  }
}
