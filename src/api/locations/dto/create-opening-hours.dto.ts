import { Transform } from 'class-transformer';
import {
  IsArray,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateOpeningHoursDto {
  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @IsArray()
  @IsString({ each: true })
  days: string[];

  @IsISO8601()
  @Transform(({ value }) => new Date(value))
  openTime: Date;

  @IsISO8601()
  @Transform(({ value }) => new Date(value))
  closeTime: Date;
}
