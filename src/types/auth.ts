export type UserRole = "user" | "admin";

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}