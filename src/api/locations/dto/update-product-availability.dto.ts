import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductAvailabilityDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber()
  quantity: number;
}
