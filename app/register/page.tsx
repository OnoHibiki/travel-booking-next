"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/app/components/auth/register-form";
import { register } from "@/app/features/auth/api/register";
import type { RegisterRequest } from "@/app/features/auth/types";

export default function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = async (values: RegisterRequest) => {
        try {
        setIsSubmitting(true);
        setErrorMessage("");

        await register(values);
        setIsSuccess(true);
        } catch (error) {
        if (error instanceof Error) {
            setErrorMessage(error.message);
        } else {
            setErrorMessage("新規登録に失敗しました。");
        }
        } finally {
        setIsSubmitting(false);
        }
    };

  if (isSuccess) {
    return (
        <main className="mx-auto max-w-md px-4 py-10">
            <section className="rounded-lg border p-6 shadow-sm">
            <h1 className="mb-2 text-3xl font-bold">新規登録が完了しました</h1>
            <p className="mb-6 text-sm text-gray-600">
                アカウントの作成が完了しました。ログインして予約機能をご利用ください。
            </p>
            <Link
                href="/login"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                ログインへ進む
            </Link>
            </section>
        </main>
    );
  }

    return (
        <main className="mx-auto max-w-md px-4 py-10">
        <section className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">新規登録</h1>
            <p className="text-sm text-gray-600">
            アカウントを作成して、予約機能を利用できるようにします。
            </p>
        </section>

        {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
            </div>
        )}

        {isSubmitting && (
            <p className="mb-4 text-sm text-gray-600">登録中...</p>
        )}

        <RegisterForm onSubmit={handleRegister} />

        <div className="mt-4 text-sm text-gray-600">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
            </Link>
        </div>
        </main>
    );
}