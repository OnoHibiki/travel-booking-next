import { apiClient } from "@/app/lib/api/client";
import type { CreateReservationRequest, Reservation } from "../types";

export async function createReservation(
    body: CreateReservationRequest,
    token: string
): Promise<Reservation> {
    return apiClient.post<Reservation>("/api/reservations", body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}