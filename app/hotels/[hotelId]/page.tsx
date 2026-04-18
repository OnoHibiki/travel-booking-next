"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getHotelDetail } from "@/app/features/hotels/api/get-hotel-detail";
import { getHotelRooms } from "@/app/features/hotels/api/get-hotel-rooms";
import { RoomList } from "@/app/components/hotels/room-list";
import type { Hotel, Room } from "@/app/features/hotels/types";

export default function HotelDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const hotelId = params.hotelId as string;

    const checkIn = searchParams.get("checkIn") ?? undefined;
    const checkOut = searchParams.get("checkOut") ?? undefined;

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hotelData, roomData] = await Promise.all([
                    getHotelDetail(hotelId),
                    getHotelRooms({ hotelId, checkIn, checkOut }),
                ]);

                setHotel(hotelData);
                setRooms(roomData);
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hotelId, checkIn, checkOut]);

    if(loading) return <p>読み込み中...</p>;
    if(!hotel) return <p>ホテルが見つかりません</p>;

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
            <p className="text-gray-600 mb-6">{hotel.prefecture}</p>
            <section>
                <h2 className="text-2xl font-semibold mb-4">部屋一覧</h2>
                <RoomList rooms={rooms} checkIn={checkIn} checkOut={checkOut} />
            </section>
        </main>
    )
}