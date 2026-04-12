import { PrismaClient } from "@prisma/client";
import { fakerJA as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// 47都道府県のリスト
const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

async function main() {
  // 1. 既存データの削除
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  // 2. テストユーザー作成
  await prisma.user.create({
    data: {
      name: 'Hibiki Ono',
      email: 'test@example.com',
      prefecture: '大阪府',
      password_hash: 'hashpassword',
    },
  });

  console.log("全県ホテルの生成を開始します...");

  // 3. 都道府県リストをループして、各県に1軒ずつ作成
  for (const pref of prefectures) {
    await prisma.hotel.create({
      data: {
        name: `${pref}${faker.company.name()} ホテル`, // 「東京都〇〇商事 ホテル」のようになる
        prefecture: pref, // ここで確実に全県指定
        address_line: faker.location.streetAddress(),
        description: `${pref}の観光に最適なロケーションです。${faker.lorem.sentence()}`,
        cover_image_url: `https://images.unsplash.com/photo-${faker.number.int({ min: 1000, max: 2000 })}?auto=format&fit=crop&w=800&q=80`,
        rating: faker.number.int({ min: 1, max: 5 }),
        rooms: {
          create: [
            { name: 'スタンダードルーム', capacity: 2, price_per_night: faker.number.int({ min: 8000, max: 20000 }) },
            { name: 'デラックスルーム', capacity: 4, price_per_night: faker.number.int({ min: 25000, max: 50000 }) },
          ],
        },
      },
    });
  }

  console.log(`完了！ 47都道府県に計${prefectures.length}軒のホテルを作成しました。`);
}

main()
  .then(() => console.log('Seed成功！'))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });