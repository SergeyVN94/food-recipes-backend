import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { MailService } from '@/modules/mail/mail.service';
import { UserRole } from '@/modules/user/types';
import { UserService } from '@/modules/user/user.service';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistryDto } from './dto/user-registry.dto';
import { EmailVerifyLastTimeEntity } from './email-verify-last-time.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(EmailVerifyLastTimeEntity)
    private readonly emailVerifyLastTimeRepository: Repository<EmailVerifyLastTimeEntity>,
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

  async validateConfirmationToken(token: string) {
    const { email, type } = this.verifyConfirmationToken(token);

    if (!email || type !== 'confirm') {
      throw new NotFoundException('INVALID_TOKEN');
    }

    const result = await this.userService.confirmEmail(email);

    if (!result.affected) {
      throw new NotFoundException('INVALID_TOKEN');
    }

    await this.removeVerifyEmailTimeLabel(email);

    return { message: 'EMAIL_VERIFIED' };
  }

  async sendUserConfirmation(email: string) {
    const user = await this.userService.findByEmailFull(email);

    if (!user || user.email !== email) {
      throw new NotFoundException('USER_NOT_EXIST');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('EMAIL_ALREADY_VERIFIED');
    }

    const emailVerifyLastTime = await this.emailVerifyLastTimeRepository.findOne({
      where: { email },
    });

    if (emailVerifyLastTime) {
      const lastTime = new Date(emailVerifyLastTime.lastTime);
      const diff = new Date().getTime() - lastTime.getTime();

      if (1000 * 60 * 60 - diff > 0) {
        throw new BadRequestException({
          message: 'EMAIL_ALREADY_SENT',
          data: emailVerifyLastTime.lastTime,
        });
      } else {
        await this.removeVerifyEmailTimeLabel(email);
      }
    }

    const token = this.generateConfirmationToken(email);

    await this.mailService.sendUserConfirmation(email, token);

    await this.emailVerifyLastTimeRepository.save({
      email,
      lastTime: new Date().toISOString(),
    });
  }

  private generateConfirmationToken(email: string) {
    return this.jwtService.sign({ email, type: 'confirm' }, { expiresIn: '1h' });
  }

  private verifyConfirmationToken(token: string) {
    return this.jwtService.verify<{ email: string; type: 'confirm' }>(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  private async removeVerifyEmailTimeLabel(email: string) {
    await this.emailVerifyLastTimeRepository.delete({ email });
  }
}
