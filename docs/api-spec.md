## Endpoints

### Hotels / Rooms

- `GET /hotels?prefecture=大阪府&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD`
    - 説明: 都道府県と日付で空室ホテルを検索
    - 認証: 不要

- `GET /hotels/:hotelId`
    - 説明: ホテル情報をIDで取得
    - 認証: 不要

- `GET /hotels/:hotelId/rooms`
    - 説明: 指定したホテルの部屋情報を取得
    - 認証: 不要

### Auth
- `POST /auth/register`
    - 説明: ユーザを新規登録
    - 認証: 不要

- `POST /auth/login`
    - 説明: ログインしてJWTを取得
    - 認証: 不要

- `PATCH /auth/password`
    - 説明: パスワードを変更
    - 認証: 必要

### Me
- `GET /me`
    - 説明: ユーザ情報を取得
    - 認証: 必要

- `PATCH /me`
    - 説明: プロフィール（name, email, prefecture）を更新
    - 認証: 必要

### Reservations
- `POST /reservations`
    - 説明: 予約を作成
    - 認証: 必要

- `GET /reservations`
    - 説明: 自分の予約一覧を取得
    - 認証: 必要

- `GET /reservations/:reservationId`
    - 説明: 予約詳細を取得
    - 認証: 必要

- `PATCH /reservations/:reservationId/cancel`
    - 説明: 予約をキャンセル
    - 認証: 必要
