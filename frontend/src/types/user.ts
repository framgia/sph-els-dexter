export interface ITokens {
  accessToken?: string;
  refreshToken?: string;
}

export interface ISignUp {
  name: string;
  email: string;
  password: string;
  role: number;
}