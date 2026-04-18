import { Room } from "@/app/features/hotels/types";
import { ReserveRoomButton } from "./reserve-room-button";

type Props = {
    room: Room;
    checkIn?: string;
    checkOut?: string;
};

export function RoomCard({ room, checkIn, checkOut }: Props) {
    const getStatus = () => {
        if(room.is_available === null) return '日付未指定';
        if(room.is_available) return '予約可能';
        return '満室'
    };

    const getColor = () => {
        if(room.is_available === null) return 'text-gray-500';
        if(room.is_available) return 'text-green-600';
        return 'text-red-600'
    };

    return (
        <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-bold">{room.name}</h3>

            <p className="text-sm text-gray-600">
                定員: {room.capacity}名
            </p>

            <p className="text-sm text-gray-600">
                料金: ¥{room.price_per_night.toLocaleString()}
            </p>

            <p className={`mt-2 font-semibold ${getColor()}`}>
                {getStatus()}
            </p>

            {room.is_available === true && checkIn && checkOut && (
                <ReserveRoomButton
                    roomId={room.id}
                    checkIn={checkIn}
                    checkOut={checkOut}
                />
            )}
        </div>
    );
}