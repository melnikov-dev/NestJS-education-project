import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(userAgent: string): string {
    return `Hello ${userAgent}!`;
  }
}
