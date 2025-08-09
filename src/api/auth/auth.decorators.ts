import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { AuthUserType } from 'src/types/auth.types';

export const Protected = (role: UserRole = UserRole.Customer) =>
  applyDecorators(
    SetMetadata('isAuthenticated', true),
    SetMetadata('role', role),
  );

export const AuthUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext): AuthUserType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
