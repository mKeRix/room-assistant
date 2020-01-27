import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_LOG_LEVEL === 'production'
        ? ['error', 'warn', 'log']
        : undefined
  });
  app.enableShutdownHooks();
  await app.listenAsync(6415);
}

bootstrap();
