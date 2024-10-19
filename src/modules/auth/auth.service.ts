import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserDto, UserRole, UserService } from 'src/modules/user';
import { UserRegistryDto } from './dto/user-registry.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}

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

  async signUp(user: UserRegistryDto): Promise<UserDto> {
    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(user.password, salt);
    
    return await this.userService.addUser({
      salt,
      passHash,
      userName: user.userName,
      email: user.email,
      role: UserRole.USER,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserWithPassHash(email);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passHash);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }
}
