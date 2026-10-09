-- AlterTable
ALTER TABLE "Umkm" ADD COLUMN "mapCode" VARCHAR(10);
ALTER TABLE "Umkm" ADD COLUMN "price" VARCHAR(100);
ALTER TABLE "Umkm" ADD COLUMN "discountCoupon" INTEGER;

-- Ubah kolom products menjadi array teks
ALTER TABLE "Umkm" ALTER COLUMN "products" DROP NOT NULL;
ALTER TABLE "Umkm" ALTER COLUMN "products" TYPE TEXT[] USING CASE 
    WHEN "products" IS NULL OR "products" = '' THEN ARRAY[]::TEXT[]
    ELSE string_to_array("products", ',')
END;
ALTER TABLE "Umkm" ALTER COLUMN "products" SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Umkm" ALTER COLUMN "products" SET NOT NULL;
