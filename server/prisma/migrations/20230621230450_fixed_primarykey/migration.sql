/*
  Warnings:

  - The primary key for the `Block` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "Block_hash_key";

-- AlterTable
ALTER TABLE "Block" DROP CONSTRAINT "Block_pkey",
ADD CONSTRAINT "Block_pkey" PRIMARY KEY ("blockNumber");
