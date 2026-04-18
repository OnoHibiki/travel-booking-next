import { apiClient } from "@/app/lib/api/client";

export type Room = {
    id: number;
    name: string;
    price: number;
    capacity: number;
    is_available: boolean | null;
};

type Params = {
    hotelId: string;
    checkIn?: string;
    checkOut?: string;
};

function buildQuery(params: Params) {
    const sp = new URLSearchParams();

    if(params.checkIn) sp.set("checkIn", params.checkIn);
    if(params.checkOut) sp.set("checkOut", params.checkOut);

    return sp.toString() ? `?${sp.toString()}` : "";
}

export async function getHotelRooms({
    hotelId,
    checkIn,
    checkOut,
}: Params): Promise<Room[]> {
    const query = buildQuery({ hotelId, checkIn, checkOut });
    return apiClient.get<Room[]>(
        `/api/hotels/${hotelId}/rooms${query}`
    );
}