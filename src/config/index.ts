import * as defaultConfig from './default-config.json';

export const {
  TOKEN_LIFETIME = defaultConfig.TOKEN_LIFETIME,
} = process.env;

