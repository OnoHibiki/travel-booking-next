import Link from "next/link"; //爆速
import type { Hotel } from "@/app/features/hotels/types"

type Props = {
  hotel: Hotel;
};

export function HotelCard({ hotel }: Props) {
    return (
        <article className="w-full min-w-0 rounded-lg border p-4 shadow-sm bg-white">
            <div className="mb-2">
                <h2 className="text-xl font-bold">{hotel.name}</h2>
                <p className="text-sm text-gray-600">{hotel.prefecture}</p>
            </div>

            {/* 以下、データがあったら表示 */}
            {hotel.address_line && (
                <p className="mb-2 text-sm text-gray-700">{hotel.address_line}</p>
            )}
            {hotel.description && (
                <p className="mb-4 line-clamp-3 text-gray-800 break-words">{hotel.description}</p>
            )}

            {/* ホテル詳細APIへ */}
            <Link 
                href={`/hotels/${hotel.id}`}
                className="inline-block rounded-md border px-4 text-sm font-medium hover:bg-gray-50"
            >
                詳細を見る
            </Link>

        </article>
    )
}