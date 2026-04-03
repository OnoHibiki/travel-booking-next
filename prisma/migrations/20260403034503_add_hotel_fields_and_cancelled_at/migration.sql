-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "address_line" TEXT,
ADD COLUMN     "cover_image_url" TEXT,
ADD COLUMN     "rating" INTEGER;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "cancelled_at" TIMESTAMP(3);
