import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserService } from 'src/modules/user';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UserRegDto } from './userReg.dto';
import { UserAuthDto } from './userAuth.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('test')
  async login() {
    return await this.userService.userCount();
  }

  @Post('signup')
  async signup(@Body() userRegDto: UserRegDto) {
    console.log(userRegDto);

    const { email, login, password } = userRegDto ?? {};

    if (!email) throw new NotFoundException('email is required');
    if (!login) throw new NotFoundException('login is required');
    if (!password) throw new NotFoundException('password is required');
    if (await this.userService.isUserExist(email))
      throw new ConflictException('User exist!');

    const newUser = await this.authService.signup(userRegDto);
    return await this.authService.login(newUser);
  }

  @Post('login')
  async validate(@Body() userAuthDto: UserAuthDto) {
    const user = await this.authService.validate(
      userAuthDto.email,
      userAuthDto.password,
    );
    if (!user)
      throw new NotFoundException('User not exist or password incorrect');

    return await this.authService.login(user);
  }
}
