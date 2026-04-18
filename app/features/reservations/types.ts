export type CreateReservationRequest = {
    room_id: number;
    check_in: string;
    check_out: string;
    guest_count: number;
};

export type ReservationStatus = "CONFIRMED" | "CANCELLED";

export type Reservation = {
    id: number;
    room_id: number;
    user_id: number;
    check_in: string;
    check_out: string;
    guest_count: number;
    total_price: number;
    status: ReservationStatus;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;
};

