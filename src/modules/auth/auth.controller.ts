import {
  Body,
  ConflictException,
  Controller,
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
    const isUserExist = await this.userService.isUserExist(userRegDto.email);

    if (isUserExist) {
      throw new ConflictException('User exist');
    }

    const newUser = await this.authService.signUp(userRegDto);

    return await this.authService.signIn(newUser);
  }

  @ApiResponse({ type: TokenResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('login')
  async signIn(@Request() req) {
    return await this.authService.signIn(req.user);
  }
}
