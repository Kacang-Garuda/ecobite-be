-- DropForeignKey
ALTER TABLE "FoodDonationProgress" DROP CONSTRAINT "FoodDonationProgress_foodDonationId_fkey";

-- AddForeignKey
ALTER TABLE "FoodDonationProgress" ADD CONSTRAINT "FoodDonationProgress_foodDonationId_fkey" FOREIGN KEY ("foodDonationId") REFERENCES "FoodDonation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
