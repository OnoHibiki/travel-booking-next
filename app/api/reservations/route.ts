import { NextResponse } from "next/server";
import { PrismaClient, ReservationStatus } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

type JwtPayload = {
    userId: number
    email: string
}

// 予約作成
export async function POST(req: Request){
    try {
        const authHeader = req.headers.get('authorization')

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: '認証トークンがありません' }, { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if(!secret) {
            return NextResponse.json(
                { error: 'JWT_SECRETが設定されていません' }, { status: 500 }
            );
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, secret) as JwtPayload;
        } catch (err) {
            console.error(err);
            return NextResponse.json(
                { error: '認証に失敗しました' }, { status: 401 }
            );
        }

        const body = await req.json();
        const { room_id, check_in, check_out, guest_count } = body;

        if(!room_id || !check_in || !check_out || !guest_count) {
            return NextResponse.json(
                { error: '未入力の項目があります' }, { status: 400 }
            );
        }
        const parsedRoomId = Number(room_id);
        const parsedGuestCount = Number(guest_count);

        if(Number.isNaN(parsedRoomId) || Number.isNaN(parsedGuestCount) || parsedGuestCount <= 0) {
            return NextResponse.json(
                { error: 'room_idまたはguest_countの形式が正しくありません' }, { status: 400 }
            )
        } 

        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        if(
            Number.isNaN(checkInDate.getTime()) || 
            Number.isNaN(checkOutDate.getTime())
        ) {
            return NextResponse.json(
                { error: '日付の形式が正しくありません' }, { status: 400 }
            );
        }

        if(checkInDate >= checkOutDate) {
            return NextResponse.json(
                { error: 'チェックインはチェックアウトより前の日付を指定してください' }, { status: 400 }
            );
        }
        
        // 以下、トランザクション（全部登録か、全部失敗か）
        const result = await prisma.$transaction(async (tx) => {
            const room = await tx.room.findUnique({
                where: { id: Number(room_id) },
            });

            if(!room) {
                throw new Error('ROOM_NOT_FOUND');
            }
            if(guest_count > room.capacity) {
                throw new Error('CAPACITY_OVER');
            }

            const overlappedReservation = await tx.reservation.findFirst({
                where: {
                    room_id: Number(room_id),
                    status: ReservationStatus.CONFIRMED,
                    check_in: { lt: checkOutDate },
                    check_out: { gt: checkInDate },
                },
            });

            // 該当の部屋が既に別のユーザで予約されていた場合
            if(overlappedReservation) {
                throw new Error('ROOM_NOT_AVAILABLE');
            }

            // 宿泊日数準備
            const oneDayMs = 1000 * 60 * 60 * 24;
            const nights = Math.ceil(
                (checkOutDate.getTime() - checkInDate.getTime()) / oneDayMs
            );

            // 総料金算出
            const total_price = room.price_per_night * nights;

            // 予約情報登録
            const reservation = await tx.reservation.create({
                data: {
                    user_id: decoded.userId,
                    room_id: parsedRoomId,
                    guest_count: parsedGuestCount,
                    check_in: checkInDate,
                    check_out: checkOutDate,
                    total_price,
                    status: ReservationStatus.CONFIRMED,
                },
            });

            return reservation;
        });

        return NextResponse.json(
            { message: '予約を作成しました', reservation: result },
            { status: 201 }
        );
    } catch (error) {
        console.error(error); 

        if(error instanceof Error) {
            if (error.message === 'ROOM_NOT_FOUND') {
                return NextResponse.json(
                    { error: '部屋が見つかりません' }, { status: 404 }
                );
            }
            if(error.message === 'CAPACITY_OVER') {
                return NextResponse.json(
                    { error: '宿泊人数が部屋の定員を超えています' }, { status: 400 }
                );
            }
            if(error.message === 'ROOM_NOT_AVAILABLE') {
                return NextResponse.json(
                    { error: '指定した日程では予約できません' }, { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: '予約作成に失敗しました'}, { status: 500 }
        );
    }
}

// 予約一覧取得
export async function GET(req: Request) {
    try {
        // Authorizationヘッダー取得
        const authHeader = req.headers.get('authorization')

        // Authorizationヘッダーが空、もしくは不適切な場合
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: '認証に失敗しました'} , { status: 401 }
            )
        }

        // Bearerを除いたtokenを取得
        const token = authHeader.split(" ")[1]

        // JWT存在確認
        const secret = process.env.JWT_SECRET
        if(!secret) {
            return NextResponse.json(
                { error: 'JWT_SECRETが設定されていません。envファイルを確認してください' }, { status: 500 }
            )
        }

        // JWT検証してpayloadを取得
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, secret) as JwtPayload;
        } catch {
            return NextResponse.json(
                { error: '認証に失敗しました' }, { status: 401 }
            );
        }

        const reservations = await prisma.reservation.findMany({
            where: {
                user_id: decoded.userId,
            },
            include: {
                room: {
                    include: {
                        hotel: true,
                    },
                },
            },
            orderBy: {
                check_in: 'asc',
            }
        });

        const response = reservations.map((r) => ({
            id: r.id,
            check_in: r.check_in,
            check_out: r.check_out,
            guest_count: r.guest_count,
            total_price: r.total_price,
            status: r.status,
            hotel: {
                id: r.room.hotel.id,
                name: r.room.hotel.name,
                prefecture: r.room.hotel.prefecture,
            },
            room: {
                id: r.room.id,
                name: r.room.name,
                price: r.room.price_per_night,
                capacity: r.room.capacity,
            },
        }));

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: '予約一覧の取得に失敗しました' }, { status: 500 }
        )
    }
}

