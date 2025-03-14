import makeSlug from 'slugify';
import { DataSource } from 'typeorm';

import { AmountTypeEntity } from '@/modules/ingredients/entity/amount-types.entity';

import * as amountTypesData from './amount-types.json';

const runSeed = async (dataSource: DataSource) => {
  const entityManager = dataSource.createEntityManager();

  const amountTypes: AmountTypeEntity[] = amountTypesData.map(i => {
    const item = new AmountTypeEntity();

    item.name = i.name;
    item.slug = makeSlug(i.name, { trim: true, replacement: '_' });

    return item;
  });

  const filteredAmountTypes: AmountTypeEntity[] = [];

  for (const element of amountTypes) {
    const count = await entityManager.countBy(AmountTypeEntity, { slug: element.slug });

    if (count === 0) {
      filteredAmountTypes.push(element);
    }
  }

  try {
    await entityManager.save<AmountTypeEntity>(filteredAmountTypes);
  } catch (error) {
    console.error(error);
  }

  return 'Amount types seed success!';
};

export default runSeed;
