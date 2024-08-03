import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PaymentType } from 'src/enums/paymentType.enum';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  logo?: string;
}
