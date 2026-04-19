import { apiClient } from "@/app/lib/api/client";

export async function cancelReservation(
  reservationId: string,
  token: string
): Promise<void> {
  await apiClient.patch(
    `/api/reservations/${reservationId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}