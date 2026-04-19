"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/app/components/me/profile-form";
import { getMe } from "@/app/features/auth/api/get-me";
import { updateMe } from "@/app/features/auth/api/update-me";
import type { AuthUser } from "@/app/features/auth/types";

export default function MePage() {
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
        const token = localStorage.getItem("accessToken");

        if(!token){
            router.push("/login?redirect=/me");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");
            setSuccessMessage("");

            const data = await getMe(token);
            setUser(data);
        } catch (error) {
            if (error instanceof Error) {
            setErrorMessage(error.message);
            } else {
            setErrorMessage("ユーザー情報の取得に失敗しました。");
            }
        } finally {
            setIsLoading(false);
        }
        };

        fetchUser();
    }, [router]);

    const handleUpdate = async (values: {
        name: string;
        email: string;
        prefecture?: string;
    }) => {
        const token = localStorage.getItem("accessToken");

        if(!token){
        router.push("/login?redirect=/me");
        return;
        }

        try {
        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        const response = await updateMe(values, token);
        setUser(response.user);
        setSuccessMessage(response.message);
        } catch (error) {
        if(error instanceof Error){
            setErrorMessage(error.message);
        } else {
            setErrorMessage("ユーザー情報の更新に失敗しました。");
        }
        } finally {
        setIsSubmitting(false);
        }
    };

    if(isLoading){
        return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <p className="text-gray-600">読み込み中...</p>
        </main>
        );
    }

    if(!user){
        return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            ユーザー情報を表示できませんでした。
            </div>
        </main>
        );
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
        <section className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">ユーザー情報</h1>
            <p className="text-sm text-gray-600">
            アカウント情報の確認と変更ができます。
            </p>
        </section>

        {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
            </div>
        )}

        {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
            </div>
        )}

        {isSubmitting && (
            <p className="mb-4 text-sm text-gray-600">保存中...</p>
        )}

        <ProfileForm
            initialValues={{
            name: user.name,
            email: user.email,
            prefecture: user.prefecture ?? "",
            }}
            onSubmit={handleUpdate}
        />
        </main>
    );
}