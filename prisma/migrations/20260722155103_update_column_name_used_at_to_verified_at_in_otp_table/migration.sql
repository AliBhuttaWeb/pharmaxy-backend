/*
  Warnings:

  - You are about to drop the column `used_at` on the `otps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "otps" DROP COLUMN "used_at",
ADD COLUMN     "verified_at" TIMESTAMP(3);
