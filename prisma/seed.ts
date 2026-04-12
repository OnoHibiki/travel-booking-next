import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    // リセット
    await prisma.reservation.deleteMany()
    await prisma.room.deleteMany()
    await prisma.hotel.deleteMany()

    //テストユーザ
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {}, // すでにある場合は何もしない
        create: {
            id: 1,  // テスト用のため固定ID
            name: 'Hibiki Ono',
            prefecture: '大阪府',
            password_hash: 'hashpassword',
            email: 'test@example.com',
        },
    })

    //テストホテル1
    const osakaHotel = await prisma.hotel.create({
        include: { rooms: true },
        data: {
            id: 1, // テスト用のため固定ID
            name: 'Osaka Hotel',
            prefecture: '大阪府',
            description: '大阪といえばここやねん',
            cover_image_url: '/images/osaka-hotel.jpg',
            address_line: '大阪府大阪市大阪町大阪0001',
            rating: 4,
            rooms: {
                create: [
                    {
                        id: 1,
                        name: 'Single Room',
                        capacity: 1,
                        price_per_night: 12000,
                    },
                    {
                        id: 2,
                        name: 'Double Room',
                        capacity: 2,
                        price_per_night: 20000,
                    },
                ],
            },
        },
    })

    //テストホテル2
    const tokyoHotel = await prisma.hotel.create({
        include: { rooms: true },
        data: {
            id: 2,
            name: 'Tokyo Hotel',
            prefecture: '東京都',
            description: '東京といえばここですよ',
            cover_image_url: '/images/tokyo-hotel.jpg',
            address_line: '東京都東京区東京0002',
            rating: 3,
            rooms: {
                create: [
                    {
                        id: 3,
                        name: 'Single Room',
                        capacity: 1,
                        price_per_night: 22000,
                    },
                    {
                        id: 4,
                        name: 'Double Room',
                        capacity: 2,
                        price_per_night: 40000,
                    },
                ],
            },
        },
    })

    // 予約データ（空室/埋まりのテスト用）
    await prisma.reservation.create({
        data: {
            user_id: user.id,
            room_id: osakaHotel.rooms[0].id, // Osaka Single Room
            guest_count: 1,
            check_in: new Date("2026-05-10"),
            check_out: new Date("2026-05-12"),
            total_price: 24000,
            status: "CONFIRMED",
        },
    })

    await prisma.reservation.create({
        data: {
            user_id: user.id,
            room_id: tokyoHotel.rooms[1].id, // Tokyo Double Room
            guest_count: 2,
            check_in: new Date("2026-05-11"),
            check_out: new Date("2026-05-13"),
            total_price: 80000,
            status: "CONFIRMED",
        },
    })
    
    // キャンセル済み予約（空室判定テスト用）
    await prisma.reservation.create({
        data: {
            user_id: user.id,
            room_id: osakaHotel.rooms[0].id, // Osaka Single Room
            guest_count: 1,
            check_in: new Date("2026-06-01"),
            check_out: new Date("2026-06-03"),
            total_price: 24000,
            status: "CANCELLED",
        },
    })

}

main()
    .then(() =>{
        console.log('完了')
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
    