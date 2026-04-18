import type { Room } from "@/app/features/hotels/api/get-hotel-rooms";

type Props = {
    room: Room;
};

export function RoomCard({ room }: Props) {
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
                料金: ¥{room.price.toLocaleString()}
            </p>

            <p className={`mt-2 font-semibold ${getColor()}`}>
                {getStatus()}
            </p>
        </div>
    );
}