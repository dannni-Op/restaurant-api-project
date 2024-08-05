import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { PaymentController } from './payment.controller';

@Module({
  imports: [],
  providers: [PaymentService, PaymentRepository],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
