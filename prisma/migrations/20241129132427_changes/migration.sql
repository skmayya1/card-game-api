/*
  Warnings:

  - You are about to drop the column `userIds` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_roomID_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "userIds";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "picture" TEXT NOT NULL,
    "roomID" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
