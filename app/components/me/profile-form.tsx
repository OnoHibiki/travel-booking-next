"use client";

import { useState } from "react";
import { PREFECTURES } from "@/app/lib/constants/prefectures";

type Props = {
    initialValues: {
        name: string;
        email: string;
        prefecture: string;
    };
    onSubmit: (values: {
        name: string;
        email: string;
        prefecture?: string;
    }) => Promise<void>;
};

export function ProfileForm({ initialValues, onSubmit }: Props) {
    const [name, setName] = useState(initialValues.name);
    const [email, setEmail] = useState(initialValues.email);
    const [prefecture, setPrefecture] = useState(initialValues.prefecture);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await onSubmit({
        name,
        email,
        prefecture: prefecture || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
                ユーザー名
            </label>
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md border px-3 py-2"
                required
            />
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
                メールアドレス
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border px-3 py-2"
                required
            />
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="prefecture" className="text-sm font-medium">
                居住都道府県
            </label>
            <select
                id="prefecture"
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="rounded-md border px-3 py-2"
            >
                <option value="">選択してください</option>
                {PREFECTURES.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>

        <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            変更する
        </button>
        </form>
    );
}