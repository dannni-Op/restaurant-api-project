import { Injectable } from '@nestjs/common';
import { OrderProductRepository } from './orderProduct.repository';
import { OrderProduct } from 'src/entities/orderProduct.entity';

@Injectable()
export class OrderProductService {
  constructor(private orderProductRepository: OrderProductRepository) {}
  async create(request: OrderProduct): Promise<OrderProduct> {
    const result =
      await this.orderProductRepository.createOrderProduct(request);
    return result;
  }

  async bulk(request: OrderProduct[]): Promise<OrderProduct[]> {
    const result =
      await this.orderProductRepository.createOrderProducts(request);
    return result;
  }
}
