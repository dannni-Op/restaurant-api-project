import { Injectable } from '@nestjs/common';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderProductRepository {
  private repository = this.dataSource.getRepository(OrderProduct);

  constructor(private dataSource: DataSource) {}

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
