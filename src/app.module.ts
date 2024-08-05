import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { CommonModule } from './common/common.module';
import { LogMiddleware } from './middlewares/log.middleware';
import { RoleModule } from './modules/role/role.module';
import { CategoryModule } from './modules/category/category.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AtStrategy } from './strategies/at.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards/at.guard';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(config),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    WinstonModule.forRootAsync(winstonConfig),
    CommonModule,
    RoleModule,
    CategoryModule,
    PaymentModule,
    ProductModule,
    OrderModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    AtStrategy,
    RtStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
