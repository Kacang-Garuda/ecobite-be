/*
  Warnings:

  - You are about to drop the column `by` on the `FoodDonationProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoodDonationProgress" DROP COLUMN "by",
ADD COLUMN     "userEmail" TEXT;

-- AddForeignKey
ALTER TABLE "FoodDonationProgress" ADD CONSTRAINT "FoodDonationProgress_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
