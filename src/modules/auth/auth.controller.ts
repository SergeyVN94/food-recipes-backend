import {
  Body,
  ConflictException,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserRegistryDto } from './dto/user-registry.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtAuthGuard } from './jwt.guard';
import { UserLoginDto } from './dto/user-login.dto';
import { UserService } from '../user/user.service';

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiResponse({ type: TokenResponseDto })
  @Post('signup')
  async signUp(@Body() userRegDto: UserRegistryDto) {
    const isUserExist = await this.userService.isExist(userRegDto.email);

    if (isUserExist) {
      throw new ConflictException('User exist');
    }

    const newUser = await this.authService.signUp(userRegDto);

    return await this.authService.signIn(newUser);
  }

  @ApiResponse({ type: TokenResponseDto })
  @Post('login')
  async signIn(@Body() userLoginDto: UserLoginDto) {
    const user = await this.authService.validateUser(
      userLoginDto.email,
      userLoginDto.password,
    );

    return await this.authService.signIn(user);
  }

  @ApiResponse({ type: TokenResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {}
}
