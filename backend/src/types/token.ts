export interface ITokenBody {
  userId?: string;
  name: string;
  email: string;
  role: "student" | "admin"
}