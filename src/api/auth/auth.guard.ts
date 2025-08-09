import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { JwtConfig } from 'src/common/config/jwt.config';
import { UserRole } from 'generated/prisma';
import { DatabaseService } from 'src/integrations/database/database.service';
import { AuthUserType } from 'src/types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly database: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const protectedResource =
      this.reflector.get<boolean>('isAuthenticated', context.getHandler()) ||
      this.reflector.get<boolean>('isAuthenticated', context.getClass());

    const requiredRole =
      this.reflector.get<UserRole | undefined>('role', context.getHandler()) ??
      this.reflector.get<UserRole | undefined>('role', context.getClass());

    if (!protectedResource) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<AuthUserType>(token, {
        secret: JwtConfig.secret,
      });
      // Attach payload for use in handlers
      request['user'] = payload;

      if (requiredRole === UserRole.Admin) {
        const user = await this.database.user.findUniqueOrThrow({
          where: { id: payload.id },
          select: { role: true },
        });
        if (user.role !== UserRole.Admin) {
          throw new UnauthorizedException();
        }
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
