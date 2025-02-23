import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookmarksService } from '@/modules/bookmarks/bookmarks.service';

import { defaultBookmarks } from './constants';
import { UserRole } from './types';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private bookmarkService: BookmarksService,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      relations: { ban: true },
    });
  }

  async findById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: { ban: true },
    });
  }

  async findByName(name: string) {
    return await this.userRepository.findOne({
      where: { userName: name },
      relations: { ban: true },
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: { ban: true },
    });
  }

  async create(user: { email: string; userName: string; passHash: string; role: UserRole; salt: string }) {
    if (await this.isExist(user.email)) {
      throw new ConflictException('USER_WITH_THIS_EMAIL_EXIST');
    }

    const isNameExist =
      (await this.userRepository.count({
        where: { userName: user.userName },
      })) > 0;

    if (isNameExist) {
      throw new ConflictException('USER_WITH_THIS_NAME_EXIST');
    }

    const { id } = await this.userRepository.save(user);

    const newUser = await this.userRepository.findOne({ where: { id } });

    for (const bookmark of defaultBookmarks) {
      await this.bookmarkService.createBookmark(newUser.id, bookmark);
    }

    return newUser;
  }

  async confirmEmail(email: string) {
    return await this.userRepository.update({ email }, { isEmailVerified: true });
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
      throw new NotFoundException('User not found');
    } else {
      user.avatar = avatar;
      return await this.userRepository.update(userId, user);
    }
  }
}
