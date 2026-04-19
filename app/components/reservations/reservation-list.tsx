import type { ReservationListItem } from "@/app/features/reservations/types";
import { ReservationCard } from "./reservation-card";

type Props = {
  reservations: ReservationListItem[];
};

export function ReservationList({ reservations }: Props) {
  if(reservations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-gray-600">
        予約がありません。
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
}