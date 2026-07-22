/*
  Warnings:

  - You are about to drop the column `verified_at` on the `otps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "otps" DROP COLUMN "verified_at",
ADD COLUMN     "used_at" TIMESTAMP(3);
