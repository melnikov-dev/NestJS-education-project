import { Module } from '@nestjs/common';
import { ActorService } from './actor.service.js';
import { ActorController } from './actor.controller.js';
import { ActorEntity } from './entities/actor.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ActorEntity])],
  controllers: [ActorController],
  providers: [ActorService],
  exports: [ActorService]
})
export class ActorModule { }
