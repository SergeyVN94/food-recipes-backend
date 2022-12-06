import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { User, UserRole } from './types';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async addUser(user: {
    email: string;
    userName: string;
    passHash: string;
    role: UserRole;
  }) {
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const foundUser = await this.userRepository.findOne({ where: { email } });
    return foundUser ? (foundUser as User) : null;
  }

  async isUserExist(email: string): Promise<boolean> {
    const req = { where: { email } };
    return (await this.userRepository.count(req)) > 0;
  }

  async userCount() {
    await this.userRepository.count();
  }
}
