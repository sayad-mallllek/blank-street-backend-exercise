import {
  IsArray,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertOpeningHoursDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @IsArray()
  @IsString({ each: true })
  days: string[];

  @IsISO8601()
  openTime: string; // ISO datetime

  @IsISO8601()
  closeTime: string; // ISO datetime
}
