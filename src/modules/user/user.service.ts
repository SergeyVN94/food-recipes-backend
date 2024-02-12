import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import omit from 'lodash/omit';

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

  async getUserWithPassHash(email: string): Promise<{ user: User, hash: string } | null> {
    const foundUser = await this.userRepository.findOne({ where: { email } });
    if (!foundUser) return null;
    return ({ user: omit(foundUser, 'passHash'), hash: foundUser.passHash });
  }

  async findUserById(id: string): Promise<User | null> {
    const foundUser = await this.userRepository.findOne({ where: { id } });
    return foundUser ? omit((foundUser as User), 'passHash') : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const foundUser = await this.userRepository.findOne({ where: { email } });
    return foundUser ? omit((foundUser as User), 'passHash'): null;
  }

  async findUserByName(name: string): Promise<User | null> {
    const foundUser = await this.userRepository.findOne({
      where: { userName: name },
    });
    return foundUser ? omit((foundUser as User), 'passHash'): null;
  }

  async isUserExist(email: string): Promise<boolean> {
    const req = { where: { email } };
    return (await this.userRepository.count(req)) > 0;
  }

  async userCount() {
    await this.userRepository.count();
  }
}
