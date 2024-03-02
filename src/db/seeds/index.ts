import runSeedAmountTypes from './amount-types-seed';
import runSeedIngredients from './ingredients-seed';
import dataSource from '../data-source';

const main = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  await runSeedAmountTypes(dataSource);
  await runSeedIngredients(dataSource);
};

main().then(console.log).catch(console.error);
