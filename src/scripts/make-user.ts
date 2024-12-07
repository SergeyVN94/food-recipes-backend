import { DataSource } from 'typeorm';
import * as args from 'args';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '@/modules/user/user.entity';
import { UserRole } from '@/modules/user/types';
import dataSourceOptions from '@/config/data-source-options';

args
  .option('email', 'User email')
  .option('name', 'User name')
  .option('password', 'User password')
  .option('role', 'User role', UserRole.USER);

const main = async () => {
  const flags = args.parse(process.argv);

  if (!flags.email) {
    throw new Error('Missing required flag: --email');
  }

  if (!flags.name) {
    throw new Error('Missing required flag: --name');
  } 

  if (!flags.password) {
    throw new Error('Missing required flag: --password');
  }

  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const entityManager = dataSource.createEntityManager();

  const isUserExist = await entityManager.existsBy(UserEntity, { email: flags.email });

  if (isUserExist) {
    throw new Error('User exist');
  }

  const salt = await bcrypt.genSalt();
  const passHash = await bcrypt.hash(flags.password, salt);
  const user = new UserEntity();

  user.email = flags.email;
  user.userName = flags.name;
  user.passHash = passHash;
  user.role = flags.role;
  user.salt = salt;

  await entityManager.save(user);
  await dataSource.destroy();
  
  console.log('User created');
};

main();

