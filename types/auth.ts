export type UserRole = "USER" | "ADMIN";

export type AuthUser = {
  id: string | number;
  name: string;
  email: string;
  role?: UserRole;
};
