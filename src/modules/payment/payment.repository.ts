import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { PaymentType } from 'src/enums/paymentType.enum';
import { UpdatePaymentDto } from './dto/updatePayment.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment) private repository: Repository<Payment>,
  ) {}

  async createPayment(request: CreatePaymentDto): Promise<Payment> {
    const payment = this.repository.create(request);
    const result = await this.repository.save(payment);
    return result;
  }

  async findById(id: number): Promise<Payment | null> {
    const result = await this.repository.findOneBy({ id });
    return result;
  }

  async findByIdWithRelation(id: number): Promise<Payment | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['orders'],
    });
    return result;
  }

  async findLogoPath(path: string): Promise<string | null> {
    const result = await this.repository.findOne({
      where: {
        logo: path,
      },
      select: {
        logo: true,
      },
    });

    return result?.logo;
  }

  async findByNameAndType(
    name: string,
    type: PaymentType,
  ): Promise<Payment | null> {
    const result = await this.repository.findOneBy({ name, type });
    return result;
  }

  async findAll(): Promise<Payment[]> {
    const result = await this.repository.find();
    return result;
  }

  async updatePayment(id: number, request: UpdatePaymentDto): Promise<Payment> {
    await this.repository.update({ id }, request);
    const result = await this.findById(id);
    return result;
  }

  async deletePayment(id: number): Promise<boolean> {
    await this.repository.delete(id);
    return true;
  }
}
