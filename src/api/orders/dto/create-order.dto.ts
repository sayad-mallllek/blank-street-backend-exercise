import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  discountCodeId?: number;

  @IsOptional()
  @IsNumber()
  taxes?: number;

  @IsArray()
  @Type(() => CreateOrderProductsDto)
  items: Array<CreateOrderProductsDto>;
}

export class CreateOrderProductsDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
