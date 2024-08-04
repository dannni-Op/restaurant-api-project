import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { PaymentModule } from '../payment/payment.module';
import { ProductModule } from '../product/product.module';
import { OrderProductModule } from '../orderProduct/orderProduct.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PaymentModule,
    ProductModule,
    OrderProductModule,
    UserModule,
  ],
  exports: [],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
