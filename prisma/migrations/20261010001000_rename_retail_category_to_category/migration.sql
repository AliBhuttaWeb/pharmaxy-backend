-- RenameTable
ALTER TABLE "retail_categories" RENAME TO "categories";

-- RenameConstraints & Indexes on categories
ALTER TABLE "categories" RENAME CONSTRAINT "retail_categories_pkey" TO "categories_pkey";
ALTER INDEX "retail_categories_name_key" RENAME TO "categories_name_key";
ALTER INDEX "retail_categories_parent_id_idx" RENAME TO "categories_parent_id_idx";
ALTER INDEX "retail_categories_name_idx" RENAME TO "categories_name_idx";
ALTER TABLE "categories" RENAME CONSTRAINT "retail_categories_parent_id_fkey" TO "categories_parent_id_fkey";

-- AlterTable products: Rename column
ALTER TABLE "products" RENAME COLUMN "retail_category_id" TO "category_id";

-- RenameIndex on products
ALTER INDEX "products_retail_category_id_idx" RENAME TO "products_category_id_idx";

-- RenameConstraint on products
ALTER TABLE "products" RENAME CONSTRAINT "products_retail_category_id_fkey" TO "products_category_id_fkey";
