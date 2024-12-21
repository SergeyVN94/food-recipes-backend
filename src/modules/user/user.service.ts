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

  async findAll() {
    return await this.userRepository.find();
  }

  async findById(id: string) {
    return (await this.userRepository.findOne({ where: { id } }))?.toDto();
  }

  async findByName(name: string) {
    return (await this.userRepository.findOne({
      where: { userName: name },
    }))?.toDto();
  }

  async findByEmail(email: string) {
    return (await this.userRepository.findOne({ where: { email } }))?.toDto();
  }

  async create(user: {
    email: string;
    userName: string;
    passHash: string;
    role: UserRole;
    salt: string;
  }) {
    return await this.userRepository.save(user);
  }

  async findByEmailFull(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async isExist(email: string) {
    return (await this.userRepository.count({ where: { email } })) > 0;
  }

  async count() {
    await this.userRepository.count();
  }

  async updateAvatar(userId: string, avatar: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    } else {
      user.avatar = avatar;
      return await this.userRepository.update(userId, user);
    }
  }
}
