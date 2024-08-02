import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      username: configService.get('DATABASE_USERNAME'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
      entities: [__dirname + '/../entities/**/*.entity.{js, ts}'],
      synchronize: false,
    };
  },
  inject: [ConfigService],
};
