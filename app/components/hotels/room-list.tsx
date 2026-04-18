import { Room } from "@/app/features/hotels/types";
import { RoomCard } from "./room-card";

type Props = {
    rooms: Room[];
    checkIn?: string;
    checkOut?: string;
};

export function RoomList({ rooms, checkIn, checkOut }: Props) {
    if(rooms.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-6 text-center text-gray-600">
                部屋が見つかりませんでした
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {rooms.map((room) => (
                <RoomCard
                    key={room.id}
                    room={room}
                    checkIn={checkIn}
                    checkOut={checkOut}
                />
            ))}
        </div>
    );
}