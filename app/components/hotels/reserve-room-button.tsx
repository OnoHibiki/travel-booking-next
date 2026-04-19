"use client";

import { useRouter } from "next/navigation";

type Props = {
    roomId: number;
    checkIn?: string;
    checkOut?: string;
};

export function ReserveRoomButton({ roomId, checkIn, checkOut }: Props) {
    const router = useRouter();

    const handleClick = () => {
        if(!checkIn || !checkOut) {
            return;
        }

        const reservationParams = new URLSearchParams({
            roomId: String(roomId),
            checkIn,
            checkOut,
        });

        const reservationPath = `/reservations/register?${reservationParams.toString()}`;

        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null ;
        
        if(!token) {
            const loginParams = new URLSearchParams({
                redirect: reservationPath,
            });

            router.push(`/login?${loginParams.toString()}`);
            return;
        }

        router.push(reservationPath);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="mt-3 rounded-mb bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
        >
            この部屋を予約する
        </button>
    );
}