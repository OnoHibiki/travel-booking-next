import { apiClient } from "@/app/lib/api/client";
import type { Hotel } from "../types";

export async function getHotelDetail(hotelId: string): Promise<Hotel> {
    return apiClient.get<Hotel>(`/api/hotels/${hotelId}`);
}