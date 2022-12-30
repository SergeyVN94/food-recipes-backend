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
  id: string;
  userName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updateAt: string;
};
