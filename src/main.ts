import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api/v0');

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(configService.get<number>('DB_PORT') ?? 3000);
}
bootstrap();
