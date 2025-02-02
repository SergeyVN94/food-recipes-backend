import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@/modules/user/types';

export const DECORATOR_KEY_ACCESS_ROLES = 'accessRoles';
export const AccessRoles = (...roles: UserRole[]) => SetMetadata(DECORATOR_KEY_ACCESS_ROLES, roles);
