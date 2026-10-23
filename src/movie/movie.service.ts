import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity.js';
import { In, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto..js';
import { ActorService } from '../actor/actor.service.js';

@Injectable()
export class MovieService {
    constructor(@InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>, private readonly actorService: ActorService) { }

    async findAll(): Promise<MovieEntity[]> {
        return await this.movieRepository.find({
            order: {
                createAt: 'desc'
            },
        })
    }

    async findById(id: number): Promise<MovieEntity> {
        const movie = await this.movieRepository.findOne({
            where: {
                id
            },
        })
        if (!movie) throw new NotFoundException('movie not found')

        return movie;
    }

    async create(dto: CreateMovieDto): Promise<MovieEntity> {
        const { title, description, rating, ganre, isReleazed, actorIds } = dto

        const actors = await this.actorService.findActorsById(actorIds);

        const movie = this.movieRepository.create({ title, description, rating, ganre, isReleazed, actors });
        return await this.movieRepository.save(movie);
    }

    async update(id: number, dto: UpdateMovieDto): Promise<MovieEntity> {
        const movie = await this.findById(id);

        Object.assign(movie, dto)

        await this.movieRepository.save(movie);
        return movie
    }

    async delete(id: number): Promise<boolean> {
        await this.findById(id);

        await this.movieRepository.delete({ id })
        return true
    }
}
