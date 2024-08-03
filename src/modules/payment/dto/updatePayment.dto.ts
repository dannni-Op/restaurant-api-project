import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PaymentType } from 'src/enums/paymentType.enum';

export class UpdatePaymentDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  logo?: string;
}
