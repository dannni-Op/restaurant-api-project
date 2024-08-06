import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { Payment } from 'src/entities/payment.entity';
import { UpdatePaymentDto } from './dto/updatePayment.dto';
import { Roles } from 'src/decorators/role.decorator';

@Roles('admin')
@Controller('/payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  async create(@Body() request: CreatePaymentDto): Promise<Payment> {
    const payment = await this.paymentService.create(request);
    return payment;
  }

  @Roles('cahiser')
  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    const payment = await this.paymentService.get(id);
    return payment;
  }

  @Roles('chasier')
  @Get()
  async getAll(): Promise<Payment[]> {
    const payments = await this.paymentService.getAll();
    return payments;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdatePaymentDto,
  ): Promise<Payment> {
    if (Object.keys(request).length == 0) {
      return await this.get(id);
    }

    const payment = await this.paymentService.update(id, request);
    return payment;
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.paymentService.delete(id);
    return result;
  }
}
