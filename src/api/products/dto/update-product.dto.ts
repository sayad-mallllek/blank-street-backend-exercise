import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  name: string;
}
