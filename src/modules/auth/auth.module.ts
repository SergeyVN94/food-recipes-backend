import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '@/modules/mail/mail.module';
import { UsersModule } from '@/modules/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerifyLastTimeEntity } from './entity/email-verify-last-time.entity';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { AccessJwtStrategy } from './strategy/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';

@Module({
  providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([EmailVerifyLastTimeEntity, RefreshTokenEntity]),
    MailModule,
    UsersModule,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
