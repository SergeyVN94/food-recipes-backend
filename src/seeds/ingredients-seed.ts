import makeSlug from 'slugify';
import { DataSource } from 'typeorm';

import { AmountTypeEntity } from '@/modules/ingredients/entity/amount-types.entity';
import { IngredientEntity } from '@/modules/ingredients/entity/ingredient.entity';

import * as amountTypesData from './amount-types.json';
import * as ingredientsData from './ingredients.json';

const runSeed = async (dataSource: DataSource) => {
  const entityManager = dataSource.createEntityManager();
  const amountTypesEntity = await entityManager.find(AmountTypeEntity);

  const amountTypesEntityMapByName: Record<string, AmountTypeEntity> = amountTypesEntity.reduce((acc, val) => {
    acc[val.name] = val;

    return acc;
  }, {});

  const amountTypesMap: Record<number, AmountTypeEntity> = amountTypesData.reduce((acc, val) => {
    acc[val.id] = amountTypesEntityMapByName[val.name];

    return acc;
  }, {});

  const ingredients = ingredientsData.map(i => {
    const item = new IngredientEntity();

    item.name = i.name;
    item.slug = makeSlug(i.name, { trim: true, replacement: '_' });
    item.description = '';
    item.image = '';
    const amountTypes = i.validAmountTypes.map(id => amountTypesMap[id]).filter(Boolean);

    item.amountTypes = Array.from(new Set(amountTypes));

    return item;
  });

  try {
    await entityManager.save<IngredientEntity>(ingredients);
  } catch (error) {
    console.error(error);
  }

  return 'Ingredients seed success!';
};

export default runSeed;
