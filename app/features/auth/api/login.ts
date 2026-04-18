import { apiClient } from "@/app/lib/api/client";
import type { LoginRequest, LoginResponse } from "../types";

export async function login(body: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/auth/login", body);
}