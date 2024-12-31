import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TOKEN_LIFETIME } from '@/config';

import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { AccessJwtStrategy } from './strategy/access-jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AuthService, AccessJwtStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: TOKEN_LIFETIME },
    }),
    UserModule,
  ],
})
export class AuthModule {}
