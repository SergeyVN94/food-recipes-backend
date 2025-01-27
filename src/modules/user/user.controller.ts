import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Пользователи')
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({ type: UserDto })
  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    delete user.email;

    return user;
  }

  @ApiResponse({ type: UserDto })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getSelf(@Req() req) {
    const id = req.user.userId;
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return user;
  }
}
