/*
  Warnings:

  - Added the required column `remainingQuantity` to the `FoodDonation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodDonation" ADD COLUMN     "remainingQuantity" INTEGER NOT NULL;
