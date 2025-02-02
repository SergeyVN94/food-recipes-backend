import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { MailService } from '@/modules/mail/mail.service';
import { UserRole } from '@/modules/user/types';
import { UserService } from '@/modules/user/user.service';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistryDto } from './dto/user-registry.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(userLoginDto: UserLoginDto) {
    const user = await this.validateUser(userLoginDto.email, userLoginDto.password);

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('EMAIL_NOT_VERIFIED');
    }

    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signUp(userRegDto: UserRegistryDto) {
    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(userRegDto.password, salt);

    return await this.userService.create({
      salt,
      passHash,
      userName: userRegDto.userName,
      email: userRegDto.email,
      role: UserRole.USER,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmailFull(email);

    if (!user) {
      throw new UnauthorizedException('LOGIN_OR_PASSWORD_INCORRECT');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passHash);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('LOGIN_OR_PASSWORD_INCORRECT');
    }

    return user;
  }

  generateConfirmationToken(email: string) {
    return this.jwtService.sign({ email, type: 'confirm' }, { expiresIn: '1h' });
  }

  verifyConfirmationToken(token: string) {
    return this.jwtService.verify<{ email: string; type: 'confirm' }>(token, {
      ignoreExpiration: true,
    });
  }

  async sendUserConfirmation(email: string) {
    const user = await this.userService.findByEmailFull(email);

    if (!user || user.email !== email) {
      throw new NotFoundException('USER_NOT_EXIST');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('EMAIL_ALREADY_VERIFIED');
    }

    const token = this.generateConfirmationToken(email);

    await this.mailService.sendUserConfirmation(email, token);
  }
}
