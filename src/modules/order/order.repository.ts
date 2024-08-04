import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository {
  constructor(@InjectRepository(Order) private repository: Repository<Order>) {}

  async createOrder(request: Order): Promise<Order> {
    const order = this.repository.create(request);
    const result = await this.repository.save(order);
    return result;
  }

  async findById(id: number): Promise<Order> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['orderProducts'],
    });

    return result;
  }
}
