import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../users/decorators/user.decorator';
import { UserAuthDto } from '../users/dto/user-auth.dto';
import { UserRole } from '../users/types';
import { BansService } from './bans.service';
import { BanCreateDto } from './dto/ban-create.dto';

@ApiTags('Пользователи')
@Controller('/bans')
export class BansController {
  constructor(private bansService: BansService) {}

  @ApiBody({ type: BanCreateDto })
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('/:userId')
  async ban(@Param('userId') userId: string, @User() user: UserAuthDto, @Body() body: BanCreateDto) {
    return await this.bansService.banUser(userId, user.id, body);
  }

  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Delete('/:userId')
  async deleteBan(@Param('userId') userId: string) {
    return await this.bansService.deleteBan(userId);
  }
}
