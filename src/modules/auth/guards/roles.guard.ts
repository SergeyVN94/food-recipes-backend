import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UserAuthDto } from '@/modules/user/dto/user-auth.dto';

import { DECORATOR_KEY_ACCESS_ROLES } from '../decorators/access-roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(DECORATOR_KEY_ACCESS_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserAuthDto;

    const isValidRole = requiredRoles.includes(user.role);

    if (!isValidRole) {
      throw new ForbiddenException();
    }

    return true;
  }
}
