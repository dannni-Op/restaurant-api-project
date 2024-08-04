import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { OrderProductService } from './orderProduct.service';
import { OrderProductRepository } from './orderProduct.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  exports: [OrderProductService],
  providers: [OrderProductService, OrderProductRepository],
  controllers: [],
})
export class OrderProductModule {}
