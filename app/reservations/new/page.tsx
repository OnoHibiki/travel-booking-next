"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReservationForm } from "@/app/components/reservation-form";
import { createReservation } from "@/app/features/reservations/api/create-reservation";
import { error } from "console";

export default function NewReservationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const roomId = searchParams.get("roomId");
    const checkIn = searchParams.get("checkIn") ?? "";
    const checkOut = searchParams.get("checkOut") ?? "";

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isInvalidParams = useMemo(() => {
        return !roomId || !checkIn || !checkOut;
    }, [roomId, checkIn, checkOut]);

    const hundleSubmit = async (guestCount: number) => {
        const token = localStorage.getItem("accessToken");
        
        // ログインしてなかったらログインさせてからリダイレクト
        if(!token) {
            const currentPath = `/reservations/new?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }
        if(!roomId || !checkIn || !checkOut) {
            setErrorMessage('予約に必要な情報が不足しています');
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage("");

            await createReservation(
                {
                    room_id: Number(roomId),
                    check_in: checkIn,
                    check_out: checkOut,
                    guest_count: guestCount,
                },
                token
            );

            router.push("/reservations");
        } catch(error) {
            if(error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('予約の作成に失敗しました');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 予約に必要な情報がない場合はエラー画面を表示
    if(isInvalidParams) {
        return (
            <main className="mx-auto max-w-2xl px-4 py-10">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    情報が不足しているため、予約画面を表示できません
                </div>
            </main>
        );
    }
    
    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <section className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">予約内容の入力</h1>
                <p className="text-sm text-gray-600">
                    宿泊日と人数を確認して、予約を確定してください
                </p>
            </section>

            {isSubmitting && (
                <p className="mb-4 text-sm text-gray-600">予約を作成しています・・・</p>
            )}

            {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <ReservationForm
                checkIn={checkIn}
                checkOut={checkOut}
                onSubmit={hundleSubmit}
            />
        </main>
    )

}