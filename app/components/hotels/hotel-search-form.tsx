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
    const [errorMessage, setErrorMessage] = useState("")
    // 非推奨らしいけど、そのまま行きます
    
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if(!prefecture || !checkIn || !checkOut) {
            setErrorMessage("都道府県・チェックイン・チェックアウトをすべて入力してください。");
            return;
        }

        setErrorMessage("");

        onSearch({
            prefecture: prefecture,
            checkIn: checkIn,
            checkOut: checkOut,
        });
    };

    // HTML部分
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full mb-8 rounded-lg border p-4 shadow-sm"
        >
            {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="prefecture" className="text-sm font-medium">
                        都道府県
                    </label>
                    <select
                        id="prefecture"
                        value={prefecture}
                        onChange={(e) => setPrefecture(e.target.value)}
                        className="rounded-md border px-3 py-2"
                        required
                    >
                        <option value="">選択してください</option>
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
                        className="rounded-md border px-3 py-2"
                        required
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
                        className="rounded-md border px-3 py-2"
                        required
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