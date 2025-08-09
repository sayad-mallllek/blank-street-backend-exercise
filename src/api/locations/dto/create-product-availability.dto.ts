import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductAvailabilityDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
