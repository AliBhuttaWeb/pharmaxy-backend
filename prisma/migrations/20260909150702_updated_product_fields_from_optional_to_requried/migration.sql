/*
  Warnings:

  - Made the column `manufacturer_id` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `generic_name` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dosage_form_id` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `strength` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pack_quantity` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pack_unit` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_dosage_form_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_manufacturer_id_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "manufacturer_id" SET NOT NULL,
ALTER COLUMN "generic_name" SET NOT NULL,
ALTER COLUMN "dosage_form_id" SET NOT NULL,
ALTER COLUMN "strength" SET NOT NULL,
ALTER COLUMN "pack_quantity" SET NOT NULL,
ALTER COLUMN "pack_unit" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_dosage_form_id_fkey" FOREIGN KEY ("dosage_form_id") REFERENCES "dosage_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
