import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

// 新規ユーザ登録
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, password, prefecture } = body

        //入力値チェック
        if (!name || !email || !prefecture || !password) {
            return NextResponse.json({ error: '未入力の項目があります'}, { status: 400})
        }
        // email形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 })
        }


        //すでに登録済みのユーザか確認し、登録済みであれば排除
        const  existingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (existingUser) {
            return NextResponse.json({ error: '既に登録されているメールアドレスです'}, { status: 409})
        }

        //パスワードハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10)

        //ユーザ登録
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash: hashedPassword,
                prefecture,
            },
        })

        //ユーザ登録後、パスワードハッシュ以外をレスポンス
        const { password_hash, ...userWithoutPassword } = user
        return NextResponse.json(userWithoutPassword, { status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: '予期せぬエラーです'}, {status: 500})
    }
}