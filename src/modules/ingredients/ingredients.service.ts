import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { SearchFilterDto } from '@/dto/search-filter.dto';

import { AmountTypeDto } from './dto/amount-type.dto';
import { AmountTypeEntity } from './entity/amount-types.entity';
import { IngredientEntity } from './entity/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private ingredientsRepository: Repository<IngredientEntity>,
    @InjectRepository(AmountTypeEntity)
    private amountTypesRepository: Repository<AmountTypeEntity>,
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

    return (await this.ingredientsRepository.find(findOptions)).map(ingredient => ({
      ...ingredient,
      amountTypes: ingredient.amountTypes.map(amountType => amountType.id),
    }));
  }

  async getIngredientById(id: IngredientEntity['id']): Promise<IngredientEntity | null> {
    return await this.ingredientsRepository.findOne({
      where: { id },
    });
  }

  async getAmountTypes(): Promise<AmountTypeDto[]> {
    return await this.amountTypesRepository.find();
  }
}
