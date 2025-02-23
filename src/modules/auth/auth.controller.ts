import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '@/modules/users/decorators/user.decorator';
import { UserAuthDto } from '@/modules/users/dto/user-auth.dto';
import { UserEntity } from '@/modules/users/user.entity';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { EmailConfirmationDto } from './dto/email-confirmation.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistryDto } from './dto/user-registry.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';

@ApiTags('Аккаунт')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: UserEntity })
  @Public()
  @Post('signup')
  async signUp(@Body() userRegDto: UserRegistryDto) {
    return await this.authService.signUp(userRegDto);
  }

  @ApiResponse({ type: TokenResponseDto })
  @Public()
  @Post('login')
  async signIn(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.signIn(userLoginDto);
  }

  @ApiResponse({ type: TokenResponseDto })
  @Public()
  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh')
  async refresh(@User() user: UserAuthDto) {
    return await this.authService.refresh(user);
  }

  @ApiResponse({ description: 'Проверка токена' })
  @Get('check-token')
  checkToken() {
    return { message: 'OK' };
  }

  @Public()
  @Post('confirmation-email')
  async sendConfirmationEmail(@Body() body: EmailConfirmationDto) {
    return await this.authService.sendUserConfirmation(body.email);
  }

  @Public()
  @Get('confirmation-email/:token')
  async validateConfirmationToken(@Param('token') token: string) {
    return await this.authService.validateConfirmationToken(token);
  }
}
