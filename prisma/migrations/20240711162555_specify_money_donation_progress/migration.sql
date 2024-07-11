/*
  Warnings:

  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MoneyDonationProgressEnum" AS ENUM ('PENDING', 'CONFIRMED', 'PURCHASED', 'DISTRIBUTED');

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_moneyDonationId_fkey";

-- DropTable
DROP TABLE "Progress";

-- CreateTable
CREATE TABLE "MoneyDonationProgress" (
    "id" TEXT NOT NULL,
    "status" "MoneyDonationProgressEnum" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moneyDonationId" TEXT NOT NULL,

    CONSTRAINT "MoneyDonationProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoneyDonationProgress" ADD CONSTRAINT "MoneyDonationProgress_moneyDonationId_fkey" FOREIGN KEY ("moneyDonationId") REFERENCES "MoneyDonation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
