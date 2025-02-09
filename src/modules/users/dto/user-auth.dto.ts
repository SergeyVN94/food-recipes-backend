import { UserRole } from '../types';

export class UserAuthDto {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  banEndDate: string;
  refreshToken?: string;
}
