import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { PaymentController } from './payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService, PaymentRepository],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
