import { Transform } from 'class-transformer';
import { IsISO8601, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpsertClosingRulesDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @IsISO8601()
  @Transform(({ value }) => new Date(value))
  from: Date;

  @IsISO8601()
  @Transform(({ value }) => new Date(value))
  to: Date;
}
