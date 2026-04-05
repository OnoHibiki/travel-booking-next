import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

        // 入力値チェック
        if (!email || !password) {
            return NextResponse.json({ error: '未入力の項目があります'}, { status: 400})
        }
        // email形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 })
        }

        // ユーザ取得
        const user = await prisma.user.findUnique({
            where: { email },
        })
        // ユーザが存在しない場合
        if (!user) {
            return NextResponse.json(
                { error: 'メールアドレスまたはパスワードが正しくありません'},{ status: 401 }
            )
        }
        
        // パスワード照合
        const isValidPassword = await bcrypt.compare(password, user.password_hash)
        // パスワードが合致しない場合
        if(!isValidPassword) {
            return NextResponse.json(
                { error: 'メールアドレスまたはパスワードが正しくありません'},{ status: 401 }
            )
        }

        // ログイン後、パスワードハッシュ以外をレスポンス
        const { password_hash, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword, { status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: '予期せぬエラーです'}, {status: 500})
    }
}