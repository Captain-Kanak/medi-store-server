/*
  Warnings:

  - A unique constraint covering the columns `[name,brand,sellerId]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "medicine_name_brand_key";

-- CreateIndex
CREATE UNIQUE INDEX "medicine_name_brand_sellerId_key" ON "medicine"("name", "brand", "sellerId");
