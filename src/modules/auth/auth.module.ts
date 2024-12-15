import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@/modules/user';
import { TOKEN_LIFETIME } from '@/config';

import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { AccessJwtStrategy } from './strategy/access-jwt.strategy';

import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, AccessJwtStrategy],
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: TOKEN_LIFETIME },
    }),
  ],
})
export class AuthModule {}
