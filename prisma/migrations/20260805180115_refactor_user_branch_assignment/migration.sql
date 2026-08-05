/*
  Warnings:

  - You are about to drop the column `branch_id` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacy_id` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `user_roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,role_id]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_branch_id_fkey";

-- DropIndex
DROP INDEX "user_roles_pharmacy_id_idx";

-- DropIndex
DROP INDEX "user_roles_supplier_id_idx";

-- DropIndex
DROP INDEX "user_roles_user_id_branch_id_key";

-- AlterTable
ALTER TABLE "user_roles" DROP COLUMN "branch_id",
DROP COLUMN "pharmacy_id",
DROP COLUMN "supplier_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pharmacy_id" UUID;

-- CreateTable
CREATE TABLE "user_branches" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_branches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_branches_user_id_idx" ON "user_branches"("user_id");

-- CreateIndex
CREATE INDEX "user_branches_branch_id_idx" ON "user_branches"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_branches_user_id_branch_id_key" ON "user_branches"("user_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_branches" ADD CONSTRAINT "user_branches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_branches" ADD CONSTRAINT "user_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
