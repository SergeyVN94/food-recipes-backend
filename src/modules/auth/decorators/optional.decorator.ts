import { SetMetadata } from '@nestjs/common';

export const DECORATOR_KEY_IS_OPTIONAL = 'isOptional';
export const Optional = () => SetMetadata(DECORATOR_KEY_IS_OPTIONAL, true);
