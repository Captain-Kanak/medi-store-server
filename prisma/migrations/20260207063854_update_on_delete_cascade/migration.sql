-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_medicineId_fkey";

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "comment" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
