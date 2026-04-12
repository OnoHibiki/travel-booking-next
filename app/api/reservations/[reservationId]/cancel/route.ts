import { NextResponse } from "next/server";
import { PrismaClient, ReservationStatus } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

type JwtPayload = {
    userId: number
    email: string
}

export async function PATCH(
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
            where: { id: reservationId },
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

        // 既にキャンセル済みならキャンセルはできない
        if (reservation.status === ReservationStatus.CANCELLED) {
            return NextResponse.json(
                { error: '既にキャンセル済みの予約です' }, { status: 403 }
            )
        }

        const updated = await prisma.reservation.update({
            where: { id: reservationId },
            data: {
                status: ReservationStatus.CANCELLED,
                cancelled_at: new Date(),
            },
        });

        return NextResponse.json(
            {
                message: '予約をキャンセルしました',
                reservation: updated,
            },
            { status: 200 }
        );
    } catch(error) {    
        console.error(error);
        return NextResponse.json(
            { error: '予約のキャンセルに失敗しました'}, { status: 500 }
        );
    }
}