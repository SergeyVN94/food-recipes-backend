import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@/modules/users/types';

export const DECORATOR_KEY_ACCESS_ROLES = 'accessRoles';
export const Roles = (...roles: UserRole[]) =>
  SetMetadata(
    DECORATOR_KEY_ACCESS_ROLES,
    roles.reduce((acc, role) => {
      acc[role] = true;
      return acc;
    }, {}),
  );
