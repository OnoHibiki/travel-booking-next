import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

type JwtPayload = {
    userId: number
    email: string
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
            room: {
                id: r.room.id,
                name: r.room.name,
                hotel: {
                    id: r.room.hotel_id,
                    name: r.room.hotel.name,
                },
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