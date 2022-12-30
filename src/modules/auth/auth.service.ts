import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { User, UserRole, UserService } from 'src/modules/user';

import { UserRegDto } from './dto/userReg.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}

  async signup(user: UserRegDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    return await this.userService.addUser({
      passHash: hash,
      userName: user.login,
      email: user.email,
      role: UserRole.USER,
    });
  }

  async validate(email: string, password: string): Promise<User | null> {
    const response = await this.userService.getUserWithPassHash(email);
    if (!response) return null;
    const { hash, user } = response;
    if (!(await bcrypt.compare(password, hash))) return null;
    return user;
  }

  async login(user: User) {
    return {
      accessToken: this.jwt.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
    };
  }
}
