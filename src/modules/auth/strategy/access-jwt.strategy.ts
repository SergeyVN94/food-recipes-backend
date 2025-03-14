import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserAuthDto } from '@/modules/users/dto/user-auth.dto';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: UserAuthDto) {
    return {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
      isEmailVerified: payload.isEmailVerified,
    };
  }
}
