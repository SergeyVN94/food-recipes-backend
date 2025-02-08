import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { SearchFilterDto } from '@/dto/search-filter.dto';

import { AmountTypeDto } from './dto/amount-type.dto';
import { IngredientDto } from './dto/ingredient.dto';
import { AmountTypeEntity } from './entity/amount-types.entity';
import { IngredientEntity } from './entity/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private recipeRepository: Repository<IngredientEntity>,
    @InjectRepository(AmountTypeEntity)
    private amountTypeRepository: Repository<AmountTypeEntity>,
  ) {}

  async getIngredients(filter: SearchFilterDto) {
    const findOptions: FindManyOptions<IngredientEntity> = {
      relations: {
        amountTypes: true,
      },
    };

    const query = (filter.q ?? '').trim().toLowerCase();

    if (query.length > 0) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      findOptions.where['name'] = Like(query);
    }

    return (await this.recipeRepository.find(findOptions)).map(ingredient => ingredient.toDto());
  }

  async getIngredientById(id: IngredientEntity['id']): Promise<IngredientDto | null> {
    return (
      await this.recipeRepository.findOne({
        where: { id },
      })
    )?.toDto();
  }

  async getAmountTypes(): Promise<AmountTypeDto[]> {
    return await this.amountTypeRepository.find();
  }
}
