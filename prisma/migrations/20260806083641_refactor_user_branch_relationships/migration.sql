/*
  Warnings:

  - Added the required column `scope` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('SYSTEM', 'PHARMACY', 'SUPPLIER', 'USER');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "scope" "RoleScope" NOT NULL;
