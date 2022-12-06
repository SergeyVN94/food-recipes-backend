export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type UserRegistry = {
  login: string;
  email: string;
  password: string;
};

export type User = {
  id: number;
  userName: string;
  passHash: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updateAt: string;
};
