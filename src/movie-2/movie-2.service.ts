import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie2 } from '@prisma/client';
import { Actor2Service } from '../actor-2/actor-2.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMovie2Dto } from './dto/create-movie-2.dto.js';
import { UpdateMovie2Dto } from './dto/update-movie-2.dto.js';

@Injectable()
export class Movie2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actorService: Actor2Service,
  ) {}

  async findAll(): Promise<Movie2[]> {
    return this.prisma.movie2.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Movie2 & { actors: { id: number; name: string; createdAt: Date; updatedAt: Date }[] }> {
    const movie = await this.prisma.movie2.findUnique({
      where: { id },
      include: { actors: true },
    });

    if (!movie) {
      throw new NotFoundException('movie not found');
    }

    return movie;
  }

  async create(dto: CreateMovie2Dto): Promise<Movie2> {
    const { actorIds, imageUrl, ...movieData } = dto;
    const actors = await this.actorService.findActorsById(actorIds);

    return this.prisma.movie2.create({
      data: {
        ...movieData,
        poster: { create: { url: imageUrl } },
        actors: { connect: actors.map(({ id }) => ({ id })) },
      },
    });
  }

  async update(id: number, dto: UpdateMovie2Dto): Promise<Movie2> {
    await this.findById(id);
    const { imageUrl: _imageUrl, ...movieData } = dto;

    return this.prisma.movie2.update({
      where: { id },
      data: movieData,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.findById(id);
    await this.prisma.movie2.delete({ where: { id } });

    return true;
  }
}
