import Link from "next/link";
import type { ReservationListItem } from "@/app/features/reservations/types";

type Props = {
    reservation: ReservationListItem;
};

export function ReservationCard({ reservation }: Props) {
    const statusLabel = reservation.status === "CONFIRMED" ? "予約確定" : "キャンセル済み";

    const statusClassName = reservation.status === "CONFIRMED" ? "text-green-600" : "text-red-600";

    return (
        <article className="rounded-lg border p-4 shadow-sm">
            <div className="mb-2">
                <h2 className="text-xl font-bold">{reservation.hotel.name}</h2>
                <p className="text-sm text-gray-600">{reservation.hotel.prefecture}</p>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
                <p>部屋: {reservation.room.name}</p>
                <p>宿泊日: {reservation.check_in} ~ {reservation.check_out}</p>
                <p>人数: {reservation.guest_count}名</p>
                <p>合計料金: ¥{reservation.total_price.toLocaleString()}</p>
                <p className={`font-semibold ${statusClassName}`}>ステータス: {statusLabel}</p>
            </div>

            <Link
                href={`/reservations/${reservation.id}`}
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
            >
                詳細を見る
            </Link>
        </article>
    );
}