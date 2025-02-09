/* eslint-disable @typescript-eslint/no-unused-vars */
import * as inquirer from '@inquirer/prompts';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import dataSourceOptions from '@/config/data-source-options';
import { UserEntity } from '@/modules/users/entity/user.entity';
import { UserRole } from '@/modules/users/types';

const main = async () => {
  const name = await inquirer.input({
    message: 'User name:',
    required: true,
  });

  const email = await inquirer.input({
    message: 'User email:',
    required: true,
  });

  const password = await inquirer.password({
    message: 'User password:',
    mask: '*',
  });

  const role = await inquirer.select({
    message: 'User role:',
    choices: [
      { name: 'User', value: UserRole.USER },
      { name: 'Admin', value: UserRole.ADMIN },
    ],
  });

  console.log(`Creating user ${name} with email ${email} and role ${role}`);

  const dataSource = new DataSource({
    ...dataSourceOptions,
    entities: [__dirname + '/../**/user.entity{.ts,.js}'],
  });
  await dataSource.initialize();

  const entityManager = dataSource.createEntityManager();

  const isUserEmailExist = await entityManager.existsBy(UserEntity, {
    email,
  });

  if (isUserEmailExist) {
    throw new Error('User email already exist');
  }

  const isUserNameExist = await entityManager.existsBy(UserEntity, {
    userName: name,
  });

  if (isUserNameExist) {
    throw new Error('User name already exist');
  }

  const salt = await bcrypt.genSalt();
  const passHash = await bcrypt.hash(password, salt);
  const user = new UserEntity();

  user.email = email;
  user.userName = name;
  user.passHash = passHash;
  user.role = role;
  user.salt = salt;

  const { id } = await entityManager.save(user);
  const { passHash: _, salt: __, ...createdUser } = await entityManager.findOneBy(UserEntity, { id });
  await dataSource.destroy();

  console.log(`User created: ${JSON.stringify(createdUser, null, 2)}`);
};

void main();
