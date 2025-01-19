import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { IngredientEntity } from './entity/ingredient.entity';
import { AmountTypeEntity } from './entity/amount-types.entity';
import { IngredientDto } from './dto/ingredient.dto';
import { AmountTypeDto } from './dto/amount-type.dto';
import { SearchFilterDto } from '@/dto/search-filter.dto';

@Injectable()
export class RecipeIngredientService {
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
      findOptions.where['name'] = Like(query);
    }

    return (await this.recipeRepository.find(findOptions)).map((ingredient) =>
      ingredient.toDto(),
    );
  }

  async getIngredientById(
    id: IngredientEntity['id'],
  ): Promise<IngredientDto | null> {
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
