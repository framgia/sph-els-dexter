export interface ISession {
  loggedIn: boolean;
  accessToken?: string;
  refreshToken?: string;
}
