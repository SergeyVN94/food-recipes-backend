import { SetMetadata } from '@nestjs/common';

export const DECORATOR_KEY_IS_BANNED = 'isBanned';
export const Banned = () => SetMetadata(DECORATOR_KEY_IS_BANNED, true);
