// Create a Pagination Decorator
import { createParamDecorator } from '@nestjs/common';
import {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyRequest,
  FastifySchema,
  FastifyTypeProvider,
  RawRequestDefaultExpression,
  RawServerBase,
  RouteGenericInterface,
} from 'fastify';
import { FastifyRequestType } from 'fastify/types/type-provider';
import { PaginationDto } from '../dto/pagination.dto';

/**
 * @summary Pagination Decorator
 * @description
 * This decorator extracts pagination parameters from the request query.
 * It returns an object containing `limit` and `offset` values.
 *
 * @example
 * ```typescript
 * // In a controller
 * @Get("route")
 * async findAll(@Pagination() pagination: PaginationDto) {
 *   console.log(pagination.limit, pagination.offset);
 * }
 * ```
 */
export const Pagination = createParamDecorator<PaginationDto>((_, ctx) => {
  /* 
    For some reason `ctx` is not returning an actual type, its returning `any`.
    To save time I'll just use `as`
     */
  const request = ctx.switchToHttp().getRequest();
  const { limit, offset } = request.query as PaginationDto;

  return {
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  };
});
