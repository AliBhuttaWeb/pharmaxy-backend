-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('GLOBAL', 'PHARMACY', 'BRANCH');

-- CreateEnum
CREATE TYPE "SignupScope" AS ENUM ('PLATFORM', 'CONSOLE', 'STORE');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "parent_id" UUID,
ADD COLUMN     "role_scope" "RoleScope" NOT NULL DEFAULT 'GLOBAL',
ADD COLUMN     "signup_scope" "SignupScope";

-- CreateIndex
CREATE INDEX "roles_parent_id_idx" ON "roles"("parent_id");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
