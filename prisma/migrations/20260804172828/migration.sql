/*
  Warnings:

  - You are about to drop the column `pack_size` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pharmacy_id,phone]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pharmacy_id,email]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "pack_size",
ADD COLUMN     "pack_quantity" INTEGER,
ADD COLUMN     "pack_unit" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "customers_pharmacy_id_phone_key" ON "customers"("pharmacy_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "customers_pharmacy_id_email_key" ON "customers"("pharmacy_id", "email");
