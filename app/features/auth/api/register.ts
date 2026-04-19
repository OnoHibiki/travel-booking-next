import { apiClient } from "@/app/lib/api/client";
import type { RegisterRequest, RegisterResponse } from "../types";

export async function register(
  body: RegisterRequest
): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>("/api/auth/register", body);
}