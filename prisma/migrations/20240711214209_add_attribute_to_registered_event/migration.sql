/*
  Warnings:

  - Added the required column `reason` to the `RegisteredEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisteredEvent" ADD COLUMN     "reason" TEXT NOT NULL;
