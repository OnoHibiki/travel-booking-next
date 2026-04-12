import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

type JwtPayload = {
    userId: number
    email: string
}

// ユーザ情報取得
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

        // user取得
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        })
        //　userが存在しない場合
        if(!user) {
            return NextResponse.json(
                { error: 'ユーザが存在しません' }, { status: 404 }
            )
        }

        // password_hashをレスポンスから除外
        const { password_hash, ...userWithoutPassword } = user
        return NextResponse.json(userWithoutPassword, { status: 200 })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: '認証に失敗しました' }, { status: 500 }
        )
    }
}

// 予約一覧取得
export async function PATCH(req: Request) {
    try {
        // Authorizationヘッダー取得
        const authHeader = req.headers.get('authorization')

        // Authorizationヘッダーが空、もしくは不適切な場合
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
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
        const decoded = jwt.verify(token, secret) as JwtPayload

        // body取得
        const body = await req.json()
        const { name, email, prefecture } = body

        // 更新データ作成
        const updateData: Prisma.UserUpdateInput = {}

        if(name !== undefined)  updateData.name = name

        if(email !== undefined) {
            // email形式チェック
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if(!emailRegex.test(email)) {
                return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 })
            }
            // すでに登録済みのemailか確認し、登録済みであれば排除
            const  existingUser = await prisma.user.findFirst({
                where: { 
                    email,
                    NOT: {
                        id: decoded.userId
                    }
                },
            })
            if(existingUser) {
                return NextResponse.json({ error: '既に登録されているメールアドレスです'}, { status: 409})
            }
            updateData.email = email
        } 

        if(prefecture !== undefined) updateData.prefecture = prefecture



        // 空チェック
        if(Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: '更新するデータがありません'}, { status: 400 }
            )
        }

        // ユーザ情報更新
        const updateUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: updateData,
        })

        const { password_hash, ...userWithoutPassword } = updateUser
        return NextResponse.json(
            {
                message: 'ユーザ情報を更新しました',
                user: userWithoutPassword,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: '更新に失敗しました'}, { status: 500 }
        )
    }
}