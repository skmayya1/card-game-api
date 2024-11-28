-- CreateTable
CREATE TABLE "user" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "picture" TEXT NOT NULL,
    "roomID" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "_id" TEXT NOT NULL,
    "roomID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userIds" TEXT[],

    CONSTRAINT "Room_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomID_key" ON "Room"("roomID");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
