-- CreateEnum
CREATE TYPE "RegistEventEnum" AS ENUM ('PENDING', 'REJECTED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "RegisteredEvent" ADD COLUMN     "status" "RegistEventEnum" NOT NULL DEFAULT 'PENDING';
