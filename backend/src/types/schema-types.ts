interface ITimestamp {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuditLogs<T = any> extends ITimestamp {
  data: T;
  action?: string;
}

export interface IWordsLearned {
  wordId: string;
  learnedAt?: Date;
}

export interface IUser extends ITimestamp {
  _id?: string;
  name: string;
  avatar?: string;
  email: string;
  password: string;
  role?: number;
  auditTrail?: IAuditLogs[]
  followers?: string[];
  following?: string[];
  wordsLearned?: IWordsLearned[];
}

export interface IUserSession extends ITimestamp {
  userId: string | number;
  sessionToken: string;
}
