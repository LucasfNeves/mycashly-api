/*
  Warnings:

  - You are about to drop the column `token` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `expends_at` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "refresh_tokens_token_idx";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "token",
ADD COLUMN     "expends_at" TIMESTAMP(3) NOT NULL;
