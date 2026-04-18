"use client";

import { useState } from "react";
import type { LoginRequest } from "@/app/features/auth/types";

type Props = {
    onSubmit: (values: LoginRequest) => Promise<void>;
};

export function LoginForm({ onSubmit }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await onSubmit({
            email,
            password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6 shadow-sm">
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
                <label htmlFor="password" className="text-sm font-medium">
                    パスワード
                </label>
                <input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-md border px-3 py-2"
                    placeholder="パスワード入力"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full rounded-mb bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                ログイン
            </button>
        </form>
    );
}