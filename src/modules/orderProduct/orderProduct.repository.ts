import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductRepository {
  constructor(
    @InjectRepository(OrderProduct)
    private repository: Repository<OrderProduct>,
  ) {}

  async createOrderProduct(request: OrderProduct): Promise<OrderProduct> {
    const orderProduct = this.repository.create(request);
    const result = await this.repository.save(orderProduct);
    return result;
  }

  async createOrderProducts(request: OrderProduct[]): Promise<OrderProduct[]> {
    const orderProducts = this.repository.create(request);
    const result = await this.repository.save(orderProducts);
    return result;
  }
}
