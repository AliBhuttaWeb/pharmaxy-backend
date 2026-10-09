-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_product_type_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "products_product_type_id_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN IF EXISTS "product_type_id";

-- DropTable
DROP TABLE IF EXISTS "product_types";
