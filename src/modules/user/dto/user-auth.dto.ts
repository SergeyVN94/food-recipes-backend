import { UserRole } from '../types';

export class UserAuthDto {
  public id: string;
  public email: string;
  public role: UserRole;
  public isEmailVerified: boolean;
}
