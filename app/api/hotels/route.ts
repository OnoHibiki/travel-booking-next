import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// hotel検索（都道府県指定 or 全件)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const prefecture = searchParams.get('prefecture')

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