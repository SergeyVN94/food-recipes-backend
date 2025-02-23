import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookmarksModule } from '@/modules/bookmarks/bookmarks.module';

import { BanEntity } from '../bans/ban.entity';
import { BansModule } from '../bans/bans.module';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserEntity, BanEntity]), BookmarksModule, BansModule],
  exports: [UsersService],
})
export class UsersModule {}
