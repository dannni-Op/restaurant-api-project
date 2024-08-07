import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class SearchProduct {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  size: number;
}
