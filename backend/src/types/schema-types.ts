interface ITimestamp {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUser extends ITimestamp {
  _id?: string;
  name: string;
  avatar?: string;
  email: string;
  password: string;
  role?: number;
}
export interface IUserSession extends ITimestamp {
  userId: string | number;
  sessionToken: string;
}
