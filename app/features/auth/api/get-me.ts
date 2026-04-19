import { apiClient } from "@/app/lib/api/client";
import type { AuthUser } from "../types";

export async function getMe(token: string): Promise<AuthUser> {
  return apiClient.get<AuthUser>("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}