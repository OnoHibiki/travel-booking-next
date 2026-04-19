export type LoginRequest = {
    email: string;
    password: string;
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    prefecture: string | null;
};

export type LoginResponse = {
    token: string;
    user: AuthUser;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  prefecture?: string;
};

export type RegisterResponse = {
  id: number;
  name: string;
  email: string;
  prefecture: string | null;
};