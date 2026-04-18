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