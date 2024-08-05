import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password: string;
}
