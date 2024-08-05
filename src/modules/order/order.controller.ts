import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    const order = await this.orderService.get(id);
    return order;
  }

  @Get()
  async getAll(): Promise<Order[]> {
    const orders = await this.orderService.getAll();
    return orders;
  }
}
