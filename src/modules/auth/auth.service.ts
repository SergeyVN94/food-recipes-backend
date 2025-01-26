import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRole } from '@/modules/user/types';
import { UserService } from '@/modules/user/user.service';
import { UserDto } from '@/modules/user/dto/user.dto';

import { UserRegistryDto } from './dto/user-registry.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async signIn(user: UserDto) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwt.sign(payload),
    };
  }

  async signUp(user: UserRegistryDto) {
    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(user.password, salt);

    return await this.userService.create({
      salt,
      passHash,
      userName: user.userName,
      email: user.email,
      role: UserRole.USER,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmailFull(email);

    if (!user) {
      throw new UnauthorizedException('User or password incorrect');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passHash);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('User or password incorrect');
    }

    return user;
  }
}
