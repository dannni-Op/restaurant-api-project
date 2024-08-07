import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from 'src/entities/order.entity';
import { OrderService } from './order.service';
import { Roles } from 'src/decorators/role.decorator';
import { User } from 'src/decorators/user.decorator';
import { JwtPayloadType } from 'src/types/jwtPayload.type';
import { ResponsePaging } from 'src/types/responsePaging.type';
import { SearchOrder } from './dto/searchOrder.dto';

@Roles('admin', 'cashier')
@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(
    @User() payload: JwtPayloadType,
    @Body() request: CreateOrderDto,
  ): Promise<Order> {
    const order = await this.orderService.create(payload.sub, request);
    return order;
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    const order = await this.orderService.get(id);
    return order;
  }

  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ): Promise<ResponsePaging<Order[]>> {
    const searchRequest: SearchOrder = {
      search,
      page: page ? page : 1,
      size: size ? size : 5,
    };
    const orders = await this.orderService.getAll(searchRequest);
    return orders;
  }
}
