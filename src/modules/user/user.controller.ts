import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('Пользователи')
@Controller('/api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({ type: UserDto })
  @UseGuards(JwtAuthGuard)
  @Get()
  async self(@Req() req) {
    const { userId } = req.user ?? {};
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
