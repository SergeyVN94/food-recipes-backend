import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/modules/auth/decorators/public.decorator';
import { User } from '@/modules/users/decorators/user.decorator';

import { UserAuthDto } from './dto/user-auth.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@Controller('/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiResponse({ type: UserEntity, description: 'Получить профиль пользователя по id' })
  @Public()
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    delete user.email;
    delete user.isEmailVerified;

    return user;
  }

  @ApiResponse({ type: UserEntity, description: 'Получить свой профиль' })
  @Get()
  async getSelf(@User() authUser: UserAuthDto) {
    const user = await this.userService.findById(authUser.id);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return user;
  }
}
