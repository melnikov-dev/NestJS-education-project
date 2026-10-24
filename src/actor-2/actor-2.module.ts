import { Module } from '@nestjs/common';
import { Actor2Controller } from './actor-2.controller.js';
import { Actor2Service } from './actor-2.service.js';

@Module({
  controllers: [Actor2Controller],
  providers: [Actor2Service],
  exports: [Actor2Service],
})
export class Actor2Module {}
