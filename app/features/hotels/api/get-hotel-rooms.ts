import { apiClient } from "@/app/lib/api/client";
import { Room } from "@/app/features/hotels/types";

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