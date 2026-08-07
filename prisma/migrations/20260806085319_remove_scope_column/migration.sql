/*
  Warnings:

  - You are about to drop the column `scope` on the `roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roles" DROP COLUMN "scope";

-- DropEnum
DROP TYPE "RoleScope";
