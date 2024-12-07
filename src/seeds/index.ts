import { DataSource } from 'typeorm';

import dataSourceOptions from '@/config/data-source-options';
import runSeedAmountTypes from './amount-types-seed';
import runSeedIngredients from './ingredients-seed';

const main = async () => {
  const dataSource = new DataSource(dataSourceOptions);

  await dataSource.initialize();

  await runSeedAmountTypes(dataSource);
  await runSeedIngredients(dataSource);
};

main().then(console.log).catch(console.error);
