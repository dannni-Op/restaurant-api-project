import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @MinLength(1)
  @IsString()
  name?: string;
}
