interface ITimestamp {
  createdAt?: Date;
  updatedAt?: Date;
}

interface IActors {
  createdBy?: string;
  updatedBy?: string;
}

export interface IAuditLogs<T = any> extends ITimestamp {
  data: T;
  action?: string;
}

export interface IUser extends ITimestamp {
  _id?: string;
  name: string;
  avatar?: string;
  email: string;
  password: string;
  role?: number;
  auditTrail?: IAuditLogs[]
}

export interface IUserSession extends ITimestamp {
  userId: string | number;
  sessionToken: string;
}

export interface IWordOptions {
  id: number;
  choice: string;
  correctChoice: boolean;
}

export interface IWord extends ITimestamp, IActors {
  _id?: string;
  word: string;
  options: IWordOptions[];
}
