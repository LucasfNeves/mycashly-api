/*
  Warnings:

  - You are about to drop the column `expends_at` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "expends_at",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
