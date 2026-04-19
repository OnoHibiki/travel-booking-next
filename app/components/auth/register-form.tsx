"use client";

import { useState } from "react";
import type { RegisterRequest } from "@/app/features/auth/types";
import { PREFECTURES } from "@/app/lib/constants/prefectures";

type Props = {
    onSubmit: (values: RegisterRequest) => Promise<void>;
};

export function RegisterForm({ onSubmit }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [prefecture, setPrefecture] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await onSubmit({
        name,
        email,
        password,
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
            placeholder="尾野 響"
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
            placeholder="test@example.com"
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

        <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
            パスワード
            </label>
            <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border px-3 py-2"
            placeholder="パスワードを入力"
            required
            />
        </div>

        <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            新規登録する
        </button>
        </form>
    );
}