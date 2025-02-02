import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserAuthDto } from '@/modules/user/dto/user-auth.dto';

import { DECORATOR_KEY_IS_OPTIONAL } from '../decorators/optional.decorator';
import { DECORATOR_KEY_IS_PUBLIC } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(DECORATOR_KEY_IS_PUBLIC, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    const isOptional = this.reflector.getAllAndOverride<boolean>(DECORATOR_KEY_IS_OPTIONAL, [context.getHandler(), context.getClass()]);

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token && !isOptional) {
      throw new UnauthorizedException();
    }

    try {
      const payload: UserAuthDto = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;
    } catch {
      if (!isOptional) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
