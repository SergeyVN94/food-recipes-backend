import { SetMetadata } from '@nestjs/common';

export const DECORATOR_KEY_IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(DECORATOR_KEY_IS_PUBLIC, true);
