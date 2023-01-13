export interface IUser {
  name: string;
  avatar?: string;
  email: string;
  password: string;
  role?: number;
  createdAt?: Date;
  updatedAt?: Date;
}