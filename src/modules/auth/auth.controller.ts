import { Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserDto } from '@/modules/user/dto/user.dto';
import { UserService } from '@/modules/user/user.service';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { EmailConfirmationDto } from './dto/email-confirmation.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistryDto } from './dto/user-registry.dto';

@ApiTags('Аккаунт')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiResponse({ type: UserDto })
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

  // @ApiResponse({ type: TokenResponseDto })
  // @UseGuards(JwtAuthGuard)
  // @Post('refresh')
  // async refresh(@Request() req) {}

  @Public()
  @Post('confirmation-email')
  async sendConfirmationEmail(@Body() body: EmailConfirmationDto) {
    return await this.authService.sendUserConfirmation(body.email);
  }

  @Public()
  @Get('confirmation-email/:token')
  async validateConfirmationToken(@Query('token') token: string) {
    const { email, type } = this.authService.verifyConfirmationToken(token);

    if (!email || type !== 'confirm') {
      throw new NotFoundException('INVALID_TOKEN');
    }

    return await this.userService.confirmEmail(email);
  }
}
