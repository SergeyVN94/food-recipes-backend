import { DataSource } from 'typeorm';
const makeSlug = require('slugify');
const amountTypesData = require('./amount-types.json');

import { AmountTypeEntity } from '../../modules/recipe-ingredient/entity/amount-types.entity';

const runSeed = async (dataSource: DataSource) => {
  const entityManager = dataSource.createEntityManager();

  const amountTypes: AmountTypeEntity[] = amountTypesData.map(i => {
    const item = new AmountTypeEntity();

    item.name = i.name;
    item.slug = makeSlug(
      i.name,
      { trim: true, replacement: '_' },
    );

    return item;
  });

  const filteredAmountTypes: AmountTypeEntity[] = [];

  for (let i = 0; i < amountTypes.length; i++) {
    const element = amountTypes[i];
    const count = await entityManager.countBy(AmountTypeEntity, { slug: element.slug });

    if (count === 0) {
      filteredAmountTypes.push(element);
    }
  }

  await entityManager.save<AmountTypeEntity>(filteredAmountTypes);

  return 'Amount types seed success!';
};

export default runSeed;
