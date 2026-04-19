"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HotelSearchForm } from "@/app/components/hotels/hotel-search-form";
import { HotelList } from "@/app/components/hotels/hotel-list";
import { getHotels } from "@/app/features/hotels/api/get-hotels";
import type { GetHotelsParams, Hotel } from "@/app/features/hotels/types";
import { getMe } from "@/app/features/auth/api/get-me";
import type { AuthUser } from "@/app/features/auth/types";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const prefecture = searchParams.get("prefecture") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";

  const [AuthUser, setUser] = useState<AuthUser | null>(null);
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

  useEffect(() => {
    const fetchHotels = async () => {
      if (!prefecture || !checkIn || !checkOut) { // 全ての検索条件が必要
        setHotels([]);
        setErrorMessage("");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getHotels({
          prefecture: prefecture || undefined,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
        });

        setHotels(data);
      } catch (error) {
        if(error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("ホテル一覧の取得に失敗しました");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [prefecture, checkIn, checkOut]);

  const handleSearch = (params: GetHotelsParams) => {
    const nextParams = new URLSearchParams();

    // 検索条件があれば
    if (params.prefecture) {
      nextParams.set("prefecture", params.prefecture);
    }

    if (params.checkIn) {
      nextParams.set("checkIn", params.checkIn);
    }

    if (params.checkOut) {
      nextParams.set("checkOut", params.checkOut);
    }

    // クエリがあれば条件検索。なければ全件検索
    const queryString = nextParams.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  // ここからHTML
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 flex flex-col items-stretch gap-8">
      <section className="w-full">
        <h1 className="mb-2 text-3xl font-bold">旅行先を検索</h1>
        <p className="text-gray-600">
          都道府県と宿泊日を指定して、ホテルを検索できます。
        </p>
      </section>

      <div className="w-full">
        <HotelSearchForm
          initialValues={{
            prefecture,
            checkIn,
            checkOut,
          }}
          onSearch={handleSearch}
        />
      </div>
      
      
      <section className="w-full">
        <h2 className="mb-4 text-2xl font-semibold">ホテル一覧</h2>
        {!prefecture || !checkIn || !checkOut ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-600">
            都道府県・チェックイン・チェックアウトを入力して検索してください。
          </div>
        ) : null}
        {prefecture && checkIn && checkOut && isLoading && (
          <p className="text-gray-600">読み込み中...</p>
        )}

        {prefecture && checkIn && checkOut && !isLoading && errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
          </div>
        )}

        {prefecture && checkIn && checkOut && !isLoading && !errorMessage && (
          <HotelList hotels={hotels} checkIn={checkIn} checkOut={checkOut} />
        )}
      </section>
    </main>
  )
}