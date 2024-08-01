import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModuleAsyncOptions } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig: WinstonModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    format: winston.format.json(),
    level: configService.get('LOG') || 'debug',
    transports: [new winston.transports.Console()],
  }),
  inject: [ConfigService],
};
