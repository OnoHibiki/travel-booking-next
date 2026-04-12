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
        if(Number.isNaN(parseHotelId)) {
            return NextResponse.json(
                { error: 'hotelIdは数値で指定してください' }, { status: 400 }
            )
        }

        // チェックイン/アウトパラメータ受け取り
        const { searchParams } = new URL(req.url);
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');

        // チェックイン/アウト片方だけの指定の場合は、エラー
        if((checkIn && !checkOut) || (!checkIn && checkOut)) {
            return NextResponse.json(
                { error: 'checkInとcheckOutは両方指定してください' }, { status: 400 }
            )
        }

        // 日付形式チェック
        const checkInDate = checkIn ? new Date(checkIn) : null;
        const checkOutDate = checkOut ? new Date(checkOut) : null;

        if(
            (checkIn && Number.isNaN(checkInDate!.getTime())) ||
            (checkOut && Number.isNaN(checkOutDate!.getTime()))
        ) {
            return NextResponse.json(
                { error: '日付の形式が正しくありません' }, { status: 400 }
            )
        }

        if(checkInDate && checkOutDate && checkInDate >= checkOutDate) {
            return NextResponse.json(
                { error: 'チェックインはチェックアウトより前の日付を指定してください'}, { status: 400 }
            )
        }

        // ホテル指定
        const hotel = await prisma.hotel.findUnique({
            where: { id: parseHotelId },
        })

        // ホテルが存在しなかった場合
        if(!hotel) {
            return NextResponse.json(
                { error: 'ホテルが見つかりません'}, { status: 404 }
            )
        }
        
        const rooms = await prisma.room.findMany({
        where: { hotel_id: parseHotelId },
        include: {
            reservations: checkIn && checkOut
            ? { // 予約日付が指定されている場合
                where: {
                    check_out: { gt: new Date(checkIn) },
                    check_in: { lt: new Date(checkOut) },
                    status: { not: 'CANCELLED'},
                },
                }
            : { // 予約日付が指定されていない場合
                where: {
                    id: { in: [] }, //空配列を返す（isAvailableをtrueにするため）
                },
            },
        },
        orderBy: { price_per_night: 'asc' },
        });

        const roomsWithAvailability = rooms.map((room) => {
            const { reservations, ...roomData } = room; //　予約情報詳細を返す必要はない
            if(!checkIn || !checkOut) {
                return {
                    ...roomData,
                    is_available: null, //これが重要。予約ができるかどうかだけを返せばいい
                };
            }
            
            // 期間がかぶる予約がない場合は、isAvailableがTrueになる。あるとfalse = 予約できない
            const isAvailable = reservations.length === 0;

            return {
                ...roomData,
                is_available: isAvailable,
            };
        });

        return NextResponse.json(roomsWithAvailability, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: '部屋一覧の取得に失敗しました'}, { status: 500 }
        )
    } 
}