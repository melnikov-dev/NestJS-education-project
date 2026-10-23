import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity.js';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto..js';

@Injectable()
export class MovieService {
    constructor(@InjectRepository(MovieEntity) private readonly movieRepository: Repository<MovieEntity>) { }

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
        const movie = this.movieRepository.create(dto);
        return await this.movieRepository.save(movie);
    }

    async update(id: number, dto: UpdateMovieDto): Promise<MovieEntity> {
        const movie = await this.findById(id);

        if (!movie) throw new NotFoundException('movie not found')

        Object.assign(movie, dto)

        await this.movieRepository.save(movie);
        return movie
    }

    async delete(id: number): Promise<boolean> {
        const movie = await this.findById(id);

        if (!movie) throw new NotFoundException('movie not found')

        await this.movieRepository.delete({ id })
        return true
    }
}
