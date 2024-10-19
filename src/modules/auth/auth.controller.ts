import {
  Body,
  ConflictException,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { UserService } from 'src/modules/user';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UserRegistryDto } from './dto/user-registry.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Авторизация')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() userRegDto: UserRegistryDto) {
    console.log(userRegDto);

    const isUserExist = await this.userService.isUserExist(userRegDto.email);

    if (isUserExist) {
      throw new ConflictException('User exist');
    }

    const newUser = await this.authService.signUp(userRegDto);

    return await this.authService.signIn(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Request() req) {
    return await this.authService.signIn(req.user);
  }
}
