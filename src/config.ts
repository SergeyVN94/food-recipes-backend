import * as defaultConfig from './default-config.json';

// eslint-disable-next-line prettier/prettier
export const {
  TOKEN_LIFETIME = defaultConfig.TOKEN_LIFETIME,
} = process.env;
