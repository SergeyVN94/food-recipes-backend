import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '@/modules/mail/mail.module';
import { UserModule } from '@/modules/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerifyLastTimeEntity } from './email-verify-last-time.entity';
import { AccessJwtStrategy } from './strategy/access-jwt.strategy';

@Module({
  providers: [AuthService, AccessJwtStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_LIFETIME') },
      }),
    }),
    TypeOrmModule.forFeature([EmailVerifyLastTimeEntity]),
    MailModule,
    UserModule,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
