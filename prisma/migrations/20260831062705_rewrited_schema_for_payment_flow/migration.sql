/*
  Warnings:

  - You are about to drop the column `payment_method_id` on the `invoice_payments` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `is_cash` on the `payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacy_id` on the `payment_methods` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `payment_methods` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `payment_methods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pharmacy_payment_method_id` to the `invoice_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `payment_methods` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'CREDIT');

-- DropForeignKey
ALTER TABLE "invoice_payments" DROP CONSTRAINT "invoice_payments_payment_method_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_methods" DROP CONSTRAINT "payment_methods_pharmacy_id_fkey";

-- DropIndex
DROP INDEX "invoice_payments_payment_method_id_idx";

-- DropIndex
DROP INDEX "payment_methods_pharmacy_id_code_key";

-- DropIndex
DROP INDEX "payment_methods_pharmacy_id_idx";

-- DropIndex
DROP INDEX "payment_methods_pharmacy_id_name_key";

-- AlterTable
ALTER TABLE "invoice_payments" DROP COLUMN "payment_method_id",
ADD COLUMN     "pharmacy_payment_method_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "payment_methods" DROP COLUMN "deleted_at",
DROP COLUMN "is_cash",
DROP COLUMN "pharmacy_id",
ADD COLUMN     "provider_id" UUID,
ADD COLUMN     "type" "PaymentMethodType" NOT NULL;

-- CreateTable
CREATE TABLE "payment_providers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacy_payment_methods" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "payment_method_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharmacy_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_providers_name_key" ON "payment_providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_providers_code_key" ON "payment_providers"("code");

-- CreateIndex
CREATE INDEX "pharmacy_payment_methods_pharmacy_id_idx" ON "pharmacy_payment_methods"("pharmacy_id");

-- CreateIndex
CREATE INDEX "pharmacy_payment_methods_payment_method_id_idx" ON "pharmacy_payment_methods"("payment_method_id");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacy_payment_methods_pharmacy_id_payment_method_id_key" ON "pharmacy_payment_methods"("pharmacy_id", "payment_method_id");

-- CreateIndex
CREATE INDEX "invoice_payments_pharmacy_payment_method_id_idx" ON "invoice_payments"("pharmacy_payment_method_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_name_key" ON "payment_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_code_key" ON "payment_methods"("code");

-- CreateIndex
CREATE INDEX "payment_methods_provider_id_idx" ON "payment_methods"("provider_id");

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "payment_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_payment_methods" ADD CONSTRAINT "pharmacy_payment_methods_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_payment_methods" ADD CONSTRAINT "pharmacy_payment_methods_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_pharmacy_payment_method_id_fkey" FOREIGN KEY ("pharmacy_payment_method_id") REFERENCES "pharmacy_payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
