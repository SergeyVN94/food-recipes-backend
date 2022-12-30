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
import { UserRegDto } from './dto/userReg.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() userRegDto: UserRegDto) {
    console.log(userRegDto);

    const { email, login, password } = userRegDto ?? {};

    if (!email) throw new UnauthorizedException('email is required');
    if (!login) throw new UnauthorizedException('login is required');
    if (!password) throw new UnauthorizedException('password is required');
    if (await this.userService.isUserExist(email))
      throw new ConflictException('User exist!');

    const newUser = await this.authService.signup(userRegDto);
    return await this.authService.login(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
