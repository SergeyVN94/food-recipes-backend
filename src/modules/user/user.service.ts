import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { omit }  from 'lodash';

import { UserRole } from './types';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findUserById(id: string) {
    const foundUser = await this.userRepository.findOne({ where: { id } });

    return foundUser ? omit((foundUser as UserDto), ['passHash', 'salt']) : null;
  }

  async findUserByName(name: string) {
    const foundUser = await this.userRepository.findOne({
      where: { userName: name },
    });

    return foundUser ? omit((foundUser as UserDto), ['passHash', 'salt']) : null;
  }

  async findUserByEmail(email: string) {
    const foundUser = await this.userRepository.findOne({ where: { email } });

    delete foundUser.passHash;

    return foundUser ? omit(foundUser, ['passHash', 'salt']) : null;
  }

  async addUser(user: {
    email: string;
    userName: string;
    passHash: string;
    role: UserRole;
    salt: string;
  }) {
    return await this.userRepository.save(user);
  }

  async getUserWithPassHash(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async isUserExist(email: string) {
    const req = { where: { email } };

    return (await this.userRepository.count(req)) > 0;
  }

  async userCount() {
    await this.userRepository.count();
  }
}
