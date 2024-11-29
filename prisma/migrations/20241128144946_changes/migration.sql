-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_roomID_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "roomID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
