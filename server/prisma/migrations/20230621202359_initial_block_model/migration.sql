-- CreateTable
CREATE TABLE "Block" (
    "hash" TEXT NOT NULL,
    "parentHash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "nonce" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "gasLimit" TEXT NOT NULL,
    "gasUsed" TEXT NOT NULL,
    "miner" TEXT NOT NULL,
    "transactionCount" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("hash")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_hash_key" ON "Block"("hash");
