"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReservationDetail } from "@/app/features/reservations/api/get-reservation-detail";
import { cancelReservation } from "@/app/features/reservations/api/cancel-reservation";
import type { ReservationListItem } from "@/app/features/reservations/types";

export default function ReservationDetailPage() {
    const params = useParams();
    const router = useRouter();

    const reservationId = params.reservationId as string;

    const [reservation, setReservation] = useState<ReservationListItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchReservation = async () => {
        const token = localStorage.getItem("accessToken");

        if(!token) {
            router.push(`/login?redirect=/reservations/${reservationId}`);
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            const data = await getReservationDetail(reservationId, token);
            setReservation(data);
        } catch (error) {
            if(error instanceof Error){
            setErrorMessage(error.message);
            } else {
            setErrorMessage("予約詳細の取得に失敗しました。");
            }
        } finally {
            setIsLoading(false);
        }
        };

        fetchReservation();
    }, [reservationId, router]);

    if(isLoading){
        return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <p className="text-gray-600">読み込み中...</p>
        </main>
        );
    }

    if(errorMessage){
        return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
            </div>
        </main>
        );
    }

    if(!reservation){
        return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <div className="rounded-lg border border-dashed p-6 text-gray-600">
            予約情報が見つかりませんでした。
            </div>
        </main>
        );
    }

    const statusLabel =
        reservation.status === "CONFIRMED" ? "予約確定" : "キャンセル済み";

    const statusClassName =
        reservation.status === "CONFIRMED" ? "text-green-600" : "text-red-600";

    const handleCancel = async () => {
        const token = localStorage.getItem("accessToken");

        if(!token){
            router.push(`/login?redirect=/reservations/${reservationId}`);
            return;
        }

        try {
            await cancelReservation(reservationId, token);
            router.push("/reservations");
        } catch (error) {
            console.error(error);
            alert("キャンセルに失敗しました");
        }
    };

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <section className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">予約詳細</h1>
                <p className="text-sm text-gray-600">
                予約内容の詳細を確認できます。
                </p>
            </section>

            <article className="rounded-lg border p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">{reservation.hotel.name}</h2>
                    <p className="text-sm text-gray-600">{reservation.hotel.prefecture}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p>部屋: {reservation.room.name}</p>
                    <p>
                        宿泊日: {reservation.check_in} 〜 {reservation.check_out}
                    </p>
                    <p>人数: {reservation.guest_count}名</p>
                    <p>部屋料金: ¥{reservation.room.price.toLocaleString()}</p>
                    <p>合計料金: ¥{reservation.total_price.toLocaleString()}</p>
                    <p className={`font-semibold ${statusClassName}`}>状態: {statusLabel}</p>
                    {reservation.cancelled_at && (
                        <p>キャンセル日時: {reservation.cancelled_at}</p>
                    )}
                </div>

                {reservation.status === "CONFIRMED" && (
                    <button
                        onClick={handleCancel}
                        className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        予約をキャンセルする
                    </button>
                )}

            </article>
        </main>
    );
}