-- Moves the store onto the model the storefront on `main` uses: whole-rupee
-- prices with panel colours on products, cash-on-delivery orders with a
-- delivery day, phone and DHA area, wholesale enquiries, and no server-side
-- cart (the cart lives in the browser).
--
-- Orders placed under the previous model (address lines, cents, PENDING/PAID
-- statuses) can't be mapped onto the new one and are removed. None were
-- placed by real customers: the old model only ever ran on preview deploys.

-- Old orders and carts go first, so the enum and column changes below are safe.
DELETE FROM "OrderItem";
DELETE FROM "Order";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropTable
DROP TABLE "CartItem";
DROP TABLE "Cart";

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PLACED', 'CONFIRMED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ('PLACED'::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PLACED';
COMMIT;

-- DropIndex
DROP INDEX "Order_cartId_key";
DROP INDEX "Order_email_idx";
DROP INDEX "Order_number_key";

-- AlterTable: Order
ALTER TABLE "Order" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "cartId",
DROP COLUMN "country",
DROP COLUMN "currency",
DROP COLUMN "number",
DROP COLUMN "postcode",
DROP COLUMN "region",
DROP COLUMN "shippingCents",
DROP COLUMN "subtotalCents",
DROP COLUMN "totalCents",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "delivery" INTEGER NOT NULL,
ADD COLUMN     "deliveryDate" TEXT NOT NULL,
ADD COLUMN     "jars" INTEGER NOT NULL,
ADD COLUMN     "payment" TEXT NOT NULL DEFAULT 'cod',
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "subtotal" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PLACED',
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable: OrderItem
ALTER TABLE "OrderItem" DROP COLUMN "quantity",
DROP COLUMN "unitPriceCents",
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "qty" INTEGER NOT NULL;

-- AlterTable: Product. Prices move from minor units to whole rupees in place.
ALTER TABLE "Product" RENAME COLUMN "priceCents" TO "price";
UPDATE "Product" SET "price" = "price" / 100;
-- A row still on the very first placeholder (12.00 in cents) comes out as Rs 12; use the launch price.
UPDATE "Product" SET "price" = 1200 WHERE "price" < 100;
ALTER TABLE "Product" DROP COLUMN "currency",
ADD COLUMN     "bg" TEXT NOT NULL DEFAULT '#FFD34D',
ADD COLUMN     "dark" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "panel" TEXT NOT NULL DEFAULT '#FF8BA7';
-- The launch flavour seeded under the old model had no photo yet.
UPDATE "Product" SET "imageUrl" = '/images/shop-01-pink-lemonade.webp' WHERE "slug" = 'pink-lemonade' AND "imageUrl" IS NULL;

-- CreateTable
CREATE TABLE "WholesaleEnquiry" (
    "id" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "type" TEXT,
    "area" TEXT,
    "volume" TEXT,
    "frequency" TEXT,
    "flavours" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "message" TEXT,
    "emailed" BOOLEAN NOT NULL DEFAULT false,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WholesaleEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WholesaleEnquiry_handled_createdAt_idx" ON "WholesaleEnquiry"("handled", "createdAt");
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");
CREATE INDEX "Order_status_deliveryDate_idx" ON "Order"("status", "deliveryDate");
CREATE INDEX "Order_phone_idx" ON "Order"("phone");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
