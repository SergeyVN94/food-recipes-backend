import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserAuthDto } from '@/modules/users/dto/user-auth.dto';
import { UserRole } from '@/modules/users/types';

import { DECORATOR_KEY_IS_BANNED } from '../decorators/banned.decorator';
import { DECORATOR_KEY_IS_OPTIONAL } from '../decorators/optional.decorator';
import { DECORATOR_KEY_IS_PUBLIC } from '../decorators/public.decorator';
import { DECORATOR_KEY_ACCESS_ROLES } from '../decorators/roles.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(DECORATOR_KEY_IS_PUBLIC, [context.getHandler(), context.getClass()]);
    const isOptional = this.reflector.getAllAndOverride<boolean>(DECORATOR_KEY_IS_OPTIONAL, [context.getHandler(), context.getClass()]);
    const isBanned = this.reflector.getAllAndOverride<boolean>(DECORATOR_KEY_IS_BANNED, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token && !isOptional) {
      throw new UnauthorizedException();
    }

    let payload: UserAuthDto = null;

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        maxAge: this.configService.get<string>('JWT_LIFETIME'),
      });

      if (payload.banEndDate && !isBanned && new Date(payload.banEndDate) > new Date()) {
        throw new ForbiddenException('USER_IS_BANNED');
      }

      request.user = payload;
    } catch {
      if (!isOptional) {
        throw new UnauthorizedException();
      }
    }

    const requiredRoles = this.reflector.getAllAndOverride<Record<UserRole, boolean>>(DECORATOR_KEY_ACCESS_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (payload && requiredRoles && !requiredRoles[payload.role]) {
      throw new ForbiddenException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
