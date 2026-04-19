import { apiClient } from "@/app/lib/api/client";
import type { GetReservationsResponse } from "../types";


// 自分の予約一覧を取得
export async function getReservations(
    token: string
): Promise<GetReservationsResponse> {
    return apiClient.get<GetReservationsResponse>("/api/reservations",{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}