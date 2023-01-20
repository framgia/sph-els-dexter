export interface ISession {
  loggedIn: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUserDetails {
  name: string;
  email: string;
  avatar: string;
  role: "student" | "admin";
}
