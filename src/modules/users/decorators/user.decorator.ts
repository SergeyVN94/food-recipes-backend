import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { UserAuthDto } from '@/modules/users/dto/user-auth.dto';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user as UserAuthDto;
});
