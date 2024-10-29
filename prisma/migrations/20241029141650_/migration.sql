/*
  Warnings:

  - You are about to drop the column `user1Id` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `FriendRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderUserId,receiverUserId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_user2Id_fkey";

-- DropIndex
DROP INDEX "FriendRequest_user1Id_user2Id_key";

-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "receiverUserId" TEXT,
ADD COLUMN     "senderUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderUserId_receiverUserId_key" ON "FriendRequest"("senderUserId", "receiverUserId");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
