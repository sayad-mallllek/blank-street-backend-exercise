import { IsIn, IsInt, IsOptional, IsPositive, Min } from 'class-validator';

/**
 * @summary Pagination DTO for handling pagination parameters.
 * @description
 * This DTO is used to validate and transform pagination parameters such as `limit` and `offset`.
 * It ensures that `limit` is a positive integer and can only take specific values (10, 20, 50, 100),
 * while `offset` is a non-negative integer
 */
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsIn([10, 20, 50, 100])
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
