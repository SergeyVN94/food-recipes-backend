import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BanEntity } from './ban.entity';
import { BansController } from './bans.controller';
import { BansService } from './bans.service';

@Module({
  providers: [BansService],
  controllers: [BansController],
  exports: [BansService],
  imports: [TypeOrmModule.forFeature([BanEntity])],
})
export class BansModule {}
