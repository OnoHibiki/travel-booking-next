# API Spec - Travel Booking Site （API仕様書）

## Overview (前提ルール)
- Base URL : `/api`
- Auth : JWT (Bearer)
  - Header : `Authorization: Bearer <token>`
- Date format : `YYYY-MM-DD`

## Search Rule (検索ルール)
<!-- 完全一致が必要 -->
- `prefecture` filter is **exact match** (e.g. `大阪府`)
- `CheckIn and CheckOut` 



## Endpoints

### Public (認証不要)
- `GET /hotels?prefecture=大阪府&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD`
  - Description: Search available hotels by prefecture and date range - 空室ホテル検索
  - Auth: Not required

- `GET /hotels/:hotelId`
  - Description: Get hotel detail - ホテル情報取得（ID検索）
  - Auth: Not required

- `GET /hotels/:hotelId/rooms`
  - Description: Get rooms for a specific hotel - 特定のホテルの部屋情報取得
  - Auth: Not required

- `POST /auth/register`
  - Description: Create a new user account - ユーザ新規登録
  - Auth: Not required

- `POST /auth/login`
  - Description: Login and receive JWT token - ログインしてJWTを取得
  - Auth: Not required


### Auth Required (認証必須)

#### Auth (認証)
- `PATCH /auth/password`
  - Description: Change current user password - パスワード変更
  - Auth: Required


#### Me (プロフィール)
- `GET /me`
  - Description: Fetch current user profile - ユーザ情報取得
  - Auth: Required

- `PATCH /me`
  - Description: Update current user profile (name, email, prefecture) - プロフィール更新
  - Auth: Required


#### Reservations (予約)
- `POST /reservations`
  - Description: Create a new reservation - 新規予約
  - Auth: Required

- `GET /me/reservations`
  - Description: Fetch current user's reservations - 自分の予約一覧
  - Auth: Required

- `GET /reservations/:reservationId`
  - Description: Fetch reservation detail - 予約詳細
  - Auth: Required

- `PATCH /reservations/:reservationId/cancel`
  - Description: Cancel a reservation - 予約キャンセル
  - Auth: Required
