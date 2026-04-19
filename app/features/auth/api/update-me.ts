import { apiClient } from "@/app/lib/api/client";
import type { AuthUser } from "../types";

export type UpdateMeRequest = {
    name: string;
    email: string;
    prefecture?: string;
};

type UpdateMeResponse = {
    message: string;
    user: AuthUser;
};

export async function updateMe(
    body: UpdateMeRequest,
    token: string
): Promise<UpdateMeResponse> {
    return apiClient.patch<UpdateMeResponse>("/api/me", body, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
}