import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserService } from '@/modules/user';

import { AuthService } from './auth.service';
import { UserRegistryDto } from './dto/user-registry.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtAuthGuard } from './jwt.guard';
import { UserLoginDto } from './dto/user-login.dto';

@ApiTags('Авторизация')
@Controller('/api/v1/auth')
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
  async refresh(@Request() req) {
    
  }
}
