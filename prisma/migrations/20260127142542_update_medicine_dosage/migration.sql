/*
  Warnings:

  - Made the column `dosage` on table `medicine` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "medicine" ALTER COLUMN "dosage" SET NOT NULL;
