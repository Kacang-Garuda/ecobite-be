-- CreateEnum
CREATE TYPE "FoodDonationProgressEnum" AS ENUM ('POSTED', 'BOOKED', 'PICKED_UP');

-- CreateTable
CREATE TABLE "FoodDonationProgress" (
    "id" TEXT NOT NULL,
    "status" "FoodDonationProgressEnum" NOT NULL,
    "by" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foodDonationId" TEXT NOT NULL,

    CONSTRAINT "FoodDonationProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodDonationProgress" ADD CONSTRAINT "FoodDonationProgress_foodDonationId_fkey" FOREIGN KEY ("foodDonationId") REFERENCES "FoodDonation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
