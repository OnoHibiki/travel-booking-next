"use client";

import { useState } from "react";

type Props = {
    checkIn: string;
    checkOut: string;
    onSubmit: (guestCount: number) => Promise<void>;
};

export function ReservationForm({ checkIn, checkOut, onSubmit }: Props) {
    const [guestCount, setGuestCount] = useState(1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(guestCount);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">チェックイン</p>
                    <p className="rounded-md border bg-gray-50 px-3 py-2">{checkIn}</p>
                </div>

                <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">チェックアウト</p>
                    <p className="rounded-md border bg-gray-50 px-3 py-2">{checkOut}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="guestCount" className="text-sm font-medium">
                    宿泊人数
                </label>
                <input
                    id="guestCount"
                    type="number"
                    min={1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="rounded-md border px-3 py-2"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                予約を確定する
            </button>
        </form>
    );
}