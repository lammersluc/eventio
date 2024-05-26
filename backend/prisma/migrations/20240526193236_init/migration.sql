/*
  Warnings:

  - You are about to drop the column `image_url` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `has_picture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "image_url",
ADD COLUMN     "has_image" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "has_picture",
ADD COLUMN     "has_image" BOOLEAN NOT NULL DEFAULT false;
