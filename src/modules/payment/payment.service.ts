import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { Payment } from 'src/entities/payment.entity';
import { UpdatePaymentDto } from './dto/updatePayment.dto';

@Injectable()
export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}

  async create(request: CreatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.findByNameAndType(
      request.name,
      request.type,
    );
    if (payment) throw new ConflictException('Payment is already exist.');

    if (request.logo) {
      const pathExist = await this.paymentRepository.findLogoPath(request.logo);
      if (pathExist)
        throw new ConflictException(
          `There are payments with the same name or logo image path.`,
        );
    }

    const result = await this.paymentRepository.createPayment(request);
    return result;
  }

  async get(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment)
      throw new NotFoundException(`Payment with id ${id} not found.`);

    return payment;
  }

  async getAll(): Promise<Payment[]> {
    const payments = await this.paymentRepository.findAll();
    return payments;
  }

  async update(id: number, request: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.get(id);
    request.name = request.name ?? payment.name;
    request.type = request.type ?? payment.type;
    const checkPayment = await this.paymentRepository.findByNameAndType(
      request.name,
      request.type,
    );

    if (checkPayment && checkPayment.id !== payment.id)
      throw new ConflictException(
        `The name or type of payment you want to update already exists`,
      );

    if (request.logo) {
      const pathExist = await this.paymentRepository.findLogoPath(request.logo);
      if (pathExist && pathExist !== payment.logo)
        throw new ConflictException(
          `There are payments with the same name or logo image path.`,
        );
    }

    const result = await this.paymentRepository.updatePayment(id, request);
    return result;
  }

  async delete(id: number): Promise<boolean> {
    await this.get(id);

    const payment = await this.paymentRepository.findByIdWithRelation(id);
    if (payment.orders.length !== 0)
      throw new ConflictException(
        'The payment cannot be deleted because it is referenced by other records.',
      );

    const result = this.paymentRepository.deletePayment(id);
    return result;
  }
}
