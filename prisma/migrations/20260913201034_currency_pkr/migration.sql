-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "currency" SET DEFAULT 'PKR';

-- Rows seeded with the earlier AUD placeholder: switch to PKR and, where the
-- price is still the untouched Rs 12.00 placeholder, to the Rs 1,200 one.
UPDATE "Product" SET "priceCents" = 120000 WHERE "currency" = 'AUD' AND "priceCents" = 1200;
UPDATE "Product" SET "currency" = 'PKR' WHERE "currency" = 'AUD';
UPDATE "Order" SET "currency" = 'PKR' WHERE "currency" = 'AUD';
