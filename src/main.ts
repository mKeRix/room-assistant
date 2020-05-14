import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_LOGGER } from './logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WINSTON_LOGGER,
  });
  app.enableShutdownHooks();
  await app.listenAsync(6415);
}

bootstrap();
