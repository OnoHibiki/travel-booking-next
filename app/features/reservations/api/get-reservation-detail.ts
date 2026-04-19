import { apiClient } from "@/app/lib/api/client";
import type { ReservationListItem } from "../types";

// 詳細取得
export async function getReservationDetail(
  reservationId: string,
  token: string
): Promise<ReservationListItem> {
  return apiClient.get<ReservationListItem>(
    `/api/reservations/${reservationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}