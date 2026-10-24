import { Injectable, NotFoundException } from '@nestjs/common';
import { Actor2 } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateActor2Dto } from './dto/create-actor-2.dto.js';

@Injectable()
export class Actor2Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateActor2Dto): Promise<Actor2> {
    return this.prisma.actor2.create({ data: { name: dto.name } });
  }

  async findActorsById(actorIds: number[]): Promise<Actor2[]> {
    const actors = await this.prisma.actor2.findMany({
      where: { id: { in: actorIds } },
    });

    if (!actors.length) {
      throw new NotFoundException('One or several actors not found');
    }

    return actors;
  }
}
