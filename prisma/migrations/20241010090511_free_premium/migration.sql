/*
  Warnings:

  - You are about to drop the column `IsfreePremium` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "IsfreePremium",
ADD COLUMN     "isFreePremium" BOOLEAN NOT NULL DEFAULT false;
