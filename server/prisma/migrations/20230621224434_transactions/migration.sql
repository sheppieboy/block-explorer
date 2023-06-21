/*
  Warnings:

  - A unique constraint covering the columns `[blockNumber]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Transaction" (
    "hash" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "confirmations" INTEGER NOT NULL,
    "blockNumber" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("hash")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockNumber_key" ON "Block"("blockNumber");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_blockNumber_fkey" FOREIGN KEY ("blockNumber") REFERENCES "Block"("blockNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
