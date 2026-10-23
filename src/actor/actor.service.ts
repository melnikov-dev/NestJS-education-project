import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ActorEntity } from './entities/actor.entity.js';
import { CreateActorDto } from './dto/create-actor.dto.js';

@Injectable()
export class ActorService {
    constructor(@InjectRepository(ActorEntity)
    private readonly actorRepository: Repository<ActorEntity>) { }

    async create(dto: CreateActorDto): Promise<ActorEntity> {
        const { name } = dto;

        const actor = this.actorRepository.create({ name });
        return await this.actorRepository.save(actor);
    }

    async findActorsById(actorIds: number[]): Promise<ActorEntity[]> {
        const actors = await this.actorRepository.find({
            where: {
                id: In(actorIds)
            }
        })
        if (!actors || !actors.length) throw new NotFoundException('One or several actors not found')

        return actors
    }
}
