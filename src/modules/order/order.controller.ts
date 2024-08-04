import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from 'src/entities/order.entity';
import { OrderService } from './order.service';

@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(@Body() request: CreateOrderDto): Promise<Order> {
    const order = await this.orderService.create(1, request);
    return order;
  }
}
