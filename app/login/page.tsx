"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams  } from "next/navigation";
import { LoginForm } from "../components/auth/login-form";
import { login } from "../features/auth/api/login";
import type { LoginRequest } from "../features/auth/types";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get("redirect") || "/";
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (values: LoginRequest) => {
        try {
            setIsSubmitting(true);
            setErrorMessage("");

            const data = await login(values);

            localStorage.setItem("accessToken", data.token);
            router.push(redirect);
            router.refresh();
        } catch (error) {
            if(error instanceof Error) {
                setErrorMessage("ログインに失敗しました");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="mx-auto max-w-md px-4 py-10">
            <section className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">ログイン</h1>
                <p className="text-sm text-gray-600">
                    予約を行うにはログインが必要です
                </p>
            </section>

            {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {isSubmitting && (
                <p className="mb-4 text-sm text-gray-600">ログイン中・・・</p>
            )}

            <LoginForm onSubmit={handleLogin} />

            <div className="mt-4 text-sm text-gray-600">
                アカウントをお持ちでない方は{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                新規登録
                </Link>
            </div>
        </main>
    );
}