"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMe } from "@/app/features/auth/api/get-me";
import type { AuthUser } from "@/app/features/auth/types";

export function Header() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
        const token = localStorage.getItem("accessToken");
        if(!token) return;

        try {
            const data = await getMe(token);
            setUser(data);
        } catch {
            localStorage.removeItem("accessToken");
        }
        };

        fetchUser();
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
        location.href = "/";
    };

    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 ">
                <Link href="/" className="text-xl font-bold hover:text-red-700">
                    尾野トラベル
                </Link>

                {user ? (
                    <div className="flex items-center gap-3 text-sm">
                        <Link href="/me" className="hover:underline">ようこそ {user.name} さま</Link>
                        <button
                        onClick={handleLogout}
                        className="rounded-md border px-3 py-1 hover:bg-gray-100"
                        >
                        ログアウト
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-sm">
                        <Link
                        href="/login"
                        className="rounded-md border px-3 py-1 hover:bg-gray-100"
                        >
                        ログイン
                        </Link>

                        <Link
                        href="/register"
                        className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                        >
                        新規登録
                        </Link>
                    </div>
                )}
        </div>
    </header>
  );
}