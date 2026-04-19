"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMe } from "@/app/features/auth/api/get-me";
import type { AuthUser } from "@/app/features/auth/types";

export function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    location.href = "/";
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          尾野トラベル
        </Link>

        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span>ようこそ {user.name} さま</span>
            <button
              onClick={handleLogout}
              className="rounded-md border px-3 py-1 hover:bg-gray-100"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}