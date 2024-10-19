import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('/api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async self(@Req() req) {
    const { userId } = req.user ?? {};
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return user;
  }
}
