import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// ホテルの詳細情報を取得
export async function GET(
    req: Request,
    { params }: { params: Promise<{ hotelId: string }> }
) {
    try{
        const { hotelId } = await params
        const parseHotelId = Number(hotelId)

        // hotelIdが数値ではない場合
        if (Number.isNaN(parseHotelId)) {
            return NextResponse.json(
                { error: 'hotelIdは数値で指定してください' }, { status: 400 }
            )
        }

        const hotel = await prisma.hotel.findUnique({
            where: { id: parseHotelId },
        })

        // ホテルが存在しなかった場合
        if (!hotel) {
            return NextResponse.json(
                { error: 'ホテルが見つかりません'}, { status: 404 }
            )
        }
        return NextResponse.json(hotel, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'ホテル詳細の取得に失敗しました'}, { status: 500 }
        )
    }
}