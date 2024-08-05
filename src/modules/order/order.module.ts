import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { PaymentModule } from '../payment/payment.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PaymentModule, ProductModule, UserModule],
  exports: [],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
