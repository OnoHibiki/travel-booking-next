// ホテル型定義
export type Hotel = {
    id: number;
    name: string;
    prefecture: string;
    description: string | null;
    cover_image_url: string | null;
    address_line: string | null;
    rating: number | null; 
};

// 部屋型定義
export type Room = {
  id: number;
  name: string;
  price: number;
  capacity: number;
  is_available: boolean | null;
};

export type GetHotelsParams = {
    prefecture?: string;
    checkIn?: string;
    checkOut?: string;
}