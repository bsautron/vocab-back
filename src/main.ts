import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.LOGGER ? process.env.LOGGER.split(',') as LogLevel[] : true
  });
  await app.listen(4000);
}
bootstrap();