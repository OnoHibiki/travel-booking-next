import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

type JwtPayload = {
    userId: number
    email: string
}

// 予約の詳細取得
export async function GET(
    req: Request,
    { params } : { params: Promise<{ reservationId: string }> }
) {
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
        } catch {
            return NextResponse.json(
                { error: '認証に失敗しました' }, { status: 401 }
            );
        }

        const { reservationId: rawId } = await params;
        const reservationId = Number(rawId);
        if(Number.isNaN(reservationId)) {
            return NextResponse.json(
                { error: 'reservationIdは数値で指定してください' }, { status: 400 }
            );
        }

        // 予約取得
        const reservation = await prisma.reservation.findUnique({
            where: {
                id: reservationId,
            },
            include: {
                room: {
                    include: {
                        hotel: true, // hotelsの情報も全部持ってきて
                    },
                },
            },
        });


        if(!reservation) {
            return NextResponse.json(
                { error: '予約が見つかりません' }, { status: 404 }
            );
        }

        // 念の為,自分の予約かチェック
        if (reservation.user_id !== decoded.userId) {
            return NextResponse.json(
                { error: 'あなたの予約ではありません' }, { status: 403 }
            )
        }

        const response = {
            id: reservation.id,
            check_in: reservation.check_in,
            check_out: reservation.check_out,
            guest_count: reservation.guest_count,
            total_price: reservation.total_price,
            status: reservation.status,
            hotel: {
                id: reservation.room.hotel.id,
                name: reservation.room.hotel.name,
                prefecture: reservation.room.hotel.prefecture,
            },
            room: {
                id: reservation.room.id,
                name: reservation.room.name,
                price: reservation.room.price_per_night,
                capacity: reservation.room.capacity,
            },
        };

        return NextResponse.json(response, { status: 200 });
    } catch(error) {
        console.error(error);
        return NextResponse.json(
            { error: '予約情報の詳細取得に失敗しました '},
            { status: 500 }
        );
    }
}