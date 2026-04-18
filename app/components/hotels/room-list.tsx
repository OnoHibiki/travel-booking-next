import type { Room } from "@/app/features/hotels/api/get-hotel-rooms";
import { RoomCard } from "./room-card";

type Props = {
    rooms: Room[];
};

export function RoomList({ rooms }: Props) {
    if(rooms.length === 0) {
        return <p>部屋が見つかりません</p>;
    }

    return (
        <div className="grid gap-4">
            {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
            ))}
        </div>
    );
}