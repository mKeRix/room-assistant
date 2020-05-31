import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_LOGGER } from './logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WINSTON_LOGGER,
  });
  app.enableShutdownHooks();

  const options = new DocumentBuilder()
    .setTitle('room-assistant')
    .setDescription(
      'Presence tracking and more for automation on the room-level.'
    )
    .setVersion(pkg.version)
    .setExternalDoc('Website', 'https://room-assistant.io')
    .setLicense(
      'MIT License',
      'https://github.com/mKeRix/room-assistant/blob/master/LICENSE'
    )
    .addTag('entities', 'Access to the internal entity registry', {
      description: 'Configuration',
      url: 'https://www.room-assistant.io/guide/entities.html',
    })
    .addTag('status', 'Status information about the room-assistant instance')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listenAsync(6415);
}

bootstrap();
