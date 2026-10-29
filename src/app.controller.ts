import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service.js';
import { AuthGuard } from './common/guards/auth.guard.js';
import { UserAgent } from './common/decorators/user-agent.decorator.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseGuards(AuthGuard)
  @UseInterceptors(ResponseInterceptor)
  @Get()
  getHello(@UserAgent() userAgent: string): string {
    return this.appService.getHello(userAgent);
  }
}
