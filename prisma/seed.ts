import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    // リセット
    await prisma.reservation.deleteMany()
    await prisma.room.deleteMany()
    await prisma.hotel.deleteMany()
    await prisma.user.deleteMany()

    //テストユーザ
    await prisma.user.create({
        data: {
            name: 'Hibiki Ono',
            prefecture: '大阪府',
            password_hash: 'hashpassword',
            email: 'test@example.com',
        },
    })

    //テストホテル1
    await prisma.hotel.create({
        data: {
            name: 'Osaka Hotel',
            prefecture: '大阪府',
            description: '大阪といえばここやねん',
            cover_image_url: '/images/osaka-hotel.jpg',
            address_line: '大阪府大阪市大阪町大阪0001',
            rating: 4,
            rooms: {
                create: [
                    {
                        name: 'Single Room',
                        capacity: 1,
                        price_per_night: 12000,
                    },
                    {
                        name: 'Double Room',
                        capacity: 2,
                        price_per_night: 20000,
                    },
                ],
            },
        },
    })

    //テストホテル2
    await prisma.hotel.create({
        data: {
            name: 'Tokyo Hotel',
            prefecture: '東京都',
            description: '東京といえばここですよ',
            cover_image_url: '/images/tokyo-hotel.jpg',
            address_line: '東京都東京区東京0002',
            rating: 3,
            rooms: {
                create: [
                    {
                        name: 'Single Room',
                        capacity: 1,
                        price_per_night: 22000,
                    },
                    {
                        name: 'Double Room',
                        capacity: 2,
                        price_per_night: 40000,
                    },
                ],
            },
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
    
    