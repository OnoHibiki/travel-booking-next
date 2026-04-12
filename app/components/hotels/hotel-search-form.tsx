'use client'; // ブラウザ側で動くよ

import { useState } from "react";
import { PREFECTURES } from "@/app/lib/constants/prefectures"; // 都道府県リスト
import type { GetHotelsParams } from "@/app/features/hotels/types";

type Props = {
    initialValues?: GetHotelsParams; // 都道府県初期値
    onSearch: (params: GetHotelsParams) => void;
};

export function HotelSearchForm({ initialValues, onSearch }: Props) {
    const [prefecture, setPrefecture] = useState(initialValues?.prefecture ?? "");
    const [checkIn, setCheckIn] = useState(initialValues?.checkIn ?? "");
    const [checkOut, setCheckOut] = useState(initialValues?.checkOut ?? "");

    // 非推奨らしいけど、そのまま行きます
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        onSearch({
            prefecture: prefecture || undefined,
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
        });
    };

    // HTML部分
    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-lg border p-4 shadow-sm"
        >
            <div className="grid gap-4 md:grid-cols-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="prefecture" className="text-sm font-medium">
                        都道府県
                    </label>
                    <select
                        id="prefecture"
                        value={prefecture}
                        onChange={(e) => setPrefecture(e.target.value)}
                        className="rounded-mb border px-3 py-2"
                    >
                        <option value="">指定なし</option>
                        {PREFECTURES.map((item) => (
                            <option key={item} value={item}>
                            {item}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="checkIn" className="text-sm font-medium">
                        チェックイン
                    </label>
                    <input
                        id="checkIn"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)} 
                        className="rounded-mb border px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="checkOut" className="text-sm font-medium">
                        チェックアウト
                    </label>
                    <input 
                        id="checkOut"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)} 
                        className="rounded-mb border px-3 py-2"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        検索する
                    </button>
                </div>
            </div>
        </form>
    )
}