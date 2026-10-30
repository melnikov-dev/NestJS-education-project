import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe);
  app.useGlobalFilters(new AllExceptionsFilter)

  const config = new DocumentBuilder()
    .setTitle('NestJS education project API')
    .setDescription('API documentation for NestJS education project')
    .setVersion('1.0.0')
    .setContact('Dmitry Melnikov', 'https://t.me/MelnikovD99', 'd.melnikov.dev@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
await bootstrap();