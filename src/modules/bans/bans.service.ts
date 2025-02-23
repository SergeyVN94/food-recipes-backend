import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BanEntity } from './ban.entity';
import { BanCreateDto } from './dto/ban-create.dto';

@Injectable()
export class BansService {
  constructor(
    @InjectRepository(BanEntity)
    private banRepository: Repository<BanEntity>,
  ) {}

  async banUser(userId: string, initiatorId: string, banDto: BanCreateDto) {
    await this.banRepository.upsert(
      {
        ...banDto,
        userId,
        initiatorId,
      },
      ['userId'],
    );

    return this.banRepository.findOne({ where: { userId } });
  }

  async deleteBan(userId: string) {
    return await this.banRepository.delete({ userId });
  }
}
