import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { MailService } from '@/modules/mail/mail.service';
import { UserRole } from '@/modules/users/types';
import { UsersService } from '@/modules/users/users.service';

import { UserAuthDto } from '../users/dto/user-auth.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistryDto } from './dto/user-registry.dto';
import { EmailVerifyLastTimeEntity } from './entity/email-verify-last-time.entity';
import { RefreshTokenEntity } from './entity/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(EmailVerifyLastTimeEntity)
    private readonly emailVerifyLastTimeRepository: Repository<EmailVerifyLastTimeEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async signIn(userLoginDto: UserLoginDto) {
    const user = await this.validateUser(userLoginDto.email, userLoginDto.password);

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('EMAIL_NOT_VERIFIED');
    }

    const payload: UserAuthDto = {
      email: user.email,
      id: user.id,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      banEndDate: user.ban?.endDate || '',
    };

    const tokens = await this.generateTokens(payload);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signUp(userRegistryDto: UserRegistryDto) {
    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(userRegistryDto.password, salt);

    return await this.usersService.create({
      salt,
      passHash,
      userName: userRegistryDto.userName,
      email: userRegistryDto.email,
      role: UserRole.USER,
    });
  }

  async refresh(user: UserAuthDto) {
    if (!user.refreshToken) {
      throw new ForbiddenException('REFRESH_TOKEN_NOT_VALID');
    }

    const existUser = await this.usersService.findById(user.id);

    if (!existUser) {
      throw new ForbiddenException('USER_NOT_FOUND');
    }

    const refreshTokenEntity = await this.refreshTokenRepository.findOne({ where: { userId: user.id } });

    if (!refreshTokenEntity) {
      throw new ForbiddenException('USER_NOT_FOUND');
    }

    const tokenValid = bcrypt.compareSync(user.refreshToken, refreshTokenEntity.tokenHash);

    if (!tokenValid) {
      throw new ForbiddenException('REFRESH_TOKEN_NOT_VALID');
    }

    const payload: UserAuthDto = {
      email: user.email,
      id: user.id,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      banEndDate: existUser.ban?.endDate || '',
    };

    const tokens = await this.generateTokens(payload);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailFull(email);

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

    const result = await this.usersService.confirmEmail(email);

    if (!result.affected) {
      throw new NotFoundException('INVALID_TOKEN');
    }

    await this.removeVerifyEmailTimeLabel(email);

    return { message: 'EMAIL_VERIFIED' };
  }

  async sendUserConfirmation(email: string) {
    const user = await this.usersService.findByEmailFull(email);

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
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.refreshTokenRepository.upsert(
      {
        userId,
        tokenHash: bcrypt.hashSync(refreshToken, 2),
      },
      ['userId'],
    );
  }

  private async removeVerifyEmailTimeLabel(email: string) {
    await this.emailVerifyLastTimeRepository.delete({ email });
  }

  private async generateTokens(payload: UserAuthDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_LIFETIME'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_LIFETIME'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
