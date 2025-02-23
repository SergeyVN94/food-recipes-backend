import { connectionSource } from '@/config/typeorm';

import runSeedAmountTypes from './amount-types-seed';
import runSeedIngredients from './ingredients-seed';

const main = async () => {
  await connectionSource.initialize();

  await runSeedAmountTypes(connectionSource);
  await runSeedIngredients(connectionSource);
};

main().then(console.log).catch(console.error);
