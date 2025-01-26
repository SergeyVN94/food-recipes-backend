import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/auth/jwt.guard';

import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@ApiTags('Пользователи')
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({ type: UserDto })
  @UseGuards(JwtAuthGuard)
  @Get()
  async self(@Req() req) {
    const { userId } = req.user ?? {};

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
