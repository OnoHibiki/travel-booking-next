import { NextResponse } from "next/server";
import { PrismaClient, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient()

// hotel検索（都道府県指定 or 全件)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const prefecture = searchParams.get('prefecture');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');

        // チェックインとチェックアウトが指定された場合の検索のみ実行
        if ( checkIn || checkOut ) {
            //　どちらか片方だけ指定していた場合は、エラーに。
            if( !checkIn || !checkOut ) {
                return NextResponse.json(
                    { error: 'チェックイン日とチェックアウト日は両方指定してください'}, { status: 400 }
                )
            }

            const parsedCheckIn = new Date(checkIn);
            const parsedCheckOut = new Date(checkOut);
            
            if (Number.isNaN(parsedCheckIn.getTime()) || Number.isNaN(parsedCheckOut.getTime())) {
                return NextResponse.json(
                    { error: '日付の形式が正しくありません' }, { status: 400 }
                );
            }

            if (parsedCheckIn >= parsedCheckOut) {
                return NextResponse.json(
                    { error: 'チェックイン日はチェックアウト日より前の日付を指定してください' }, { status: 400 }
                );
            }

            const hotels = await prisma.hotel.findMany({
                where: {
                    ...(prefecture ? { prefecture } : {}),
                    rooms: {
                        some: { 
                            reservations: {
                                none: {
                                    status: ReservationStatus.CONFIRMED,
                                    check_in: { lt: parsedCheckOut },
                                    check_out: { gt: parsedCheckIn },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    id: 'asc',
                },
            });
            return NextResponse.json(hotels, { status: 200 });
        }

        //
        const hotels = await prisma.hotel.findMany({
            where: prefecture ? { prefecture } : undefined, // 都道府県指定なし＝全件
            orderBy: {
                id: 'asc',
            },
        })

        return NextResponse.json( hotels, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'ホテル検索に失敗しました'}, { status: 500 }
        )
    }
}