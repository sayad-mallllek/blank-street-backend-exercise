import { IsISO8601, IsInt, IsNotEmpty } from 'class-validator';

export class CreateClosingRulesDto {
  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @IsISO8601()
  from: string; // ISO datetime

  @IsISO8601()
  to: string; // ISO datetime
}
