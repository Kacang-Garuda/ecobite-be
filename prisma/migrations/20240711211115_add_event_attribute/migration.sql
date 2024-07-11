/*
  Warnings:

  - Added the required column `benefit` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobDescription` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "benefit" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
