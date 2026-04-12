import type { Hotel } from "@/app/features/hotels/types";
import { HotelCard } from "./hotel-card";

type Props = {
    hotels: Hotel[];
};

export function HotelList({ hotels }: Props) {
    if(hotels.length === 0) {
        return (
            <div className="w-full rounded-lg border border-dashed p-8 text-center text-gray-600">
                条件に一致するホテルが見つかりませんでした。
            </div>
        );
    }

    return (
        <div className="grid w-full grid-cols-1 gap-4">
            {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
    );
}