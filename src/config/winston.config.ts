import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModuleAsyncOptions } from 'nest-winston';

export const winstonConfig: WinstonModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: () => ({}),
  inject: [ConfigService],
};
