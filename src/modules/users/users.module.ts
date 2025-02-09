import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookmarksModule } from '@/modules/bookmarks/bookmarks.module';

import { BanEntity } from './entity/ban.entity';
import { UserEntity } from './entity/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserEntity, BanEntity]), BookmarksModule],
  exports: [UsersService],
})
export class UsersModule {}
