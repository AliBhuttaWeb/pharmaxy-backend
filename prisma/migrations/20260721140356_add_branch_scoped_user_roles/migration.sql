/*
  Warnings:

  - A unique constraint covering the columns `[user_id,branch_id]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_roles_user_id_role_id_key";

-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "branch_id" UUID,
ADD COLUMN     "pharmacy_id" UUID,
ADD COLUMN     "supplier_id" UUID;

-- CreateIndex
CREATE INDEX "user_roles_pharmacy_id_idx" ON "user_roles"("pharmacy_id");

-- CreateIndex
CREATE INDEX "user_roles_supplier_id_idx" ON "user_roles"("supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_branch_id_key" ON "user_roles"("user_id", "branch_id");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
