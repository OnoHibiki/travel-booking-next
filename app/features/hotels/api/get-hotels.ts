import { apiClient } from "@/app/lib/api/client";
import type { GetHotelsParams, Hotel } from "../types";

function buildQuery(params: GetHotelsParams): string {
    const searchParams = new URLSearchParams();

    // 検索パラメータがどの範囲まで設定されているのか？（何も設定しなくても検索は可能）
    if(params.prefecture) {
        searchParams.set('prefecture', params.prefecture);
    }
    if(params.checkIn) {
        searchParams.set('checkIn', params.checkIn);
    }
    if(params.checkOut) {
        searchParams.set('checkOut', params.checkOut);
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
}

// デフォルトで全件検索
export async function getHotels(params: GetHotelsParams = {}): Promise<Hotel[]> {
    const query = buildQuery(params);
    return apiClient.get<Hotel[]>(`/api/hotels${query}`);
}