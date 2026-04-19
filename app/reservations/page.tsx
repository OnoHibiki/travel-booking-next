"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReservations } from "@/app/features/reservations/api/get-reservations";
import { ReservationList } from "@/app/components/reservations/reservation-list";
import type { ReservationListItem } from "@/app/features/reservations/types";

export default function ReservationsPage() {
  const router = useRouter();

  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("accessToken");

      if(!token){
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getReservations(token);
        setReservations(data);
      } catch (error) {
        if(error instanceof Error){
          setErrorMessage(error.message);
        }else{
          setErrorMessage("予約一覧の取得に失敗しました。");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [router]);

  if(isLoading){
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-gray-600">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">予約一覧</h1>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      ) : (
        <ReservationList reservations={reservations} />
      )}
    </main>
  );
}