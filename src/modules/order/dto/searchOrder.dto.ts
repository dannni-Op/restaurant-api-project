import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class SearchOrder {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  size: number;
}
