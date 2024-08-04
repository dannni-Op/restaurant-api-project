import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { OrderType } from 'src/types/order.type';

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  paymentId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  totalPaid: number;

  @IsArray()
  @ArrayNotEmpty()
  products: OrderType[];
}
