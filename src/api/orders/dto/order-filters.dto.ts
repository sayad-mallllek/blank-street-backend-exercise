import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { OrderStatus } from 'generated/prisma';

export class OrderFiltersDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  @Transform(({ value }) => value?.map(Number))
  locations?: number[];

  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  @Transform(({ value }) => value?.map(Number))
  products?: number[];
}
