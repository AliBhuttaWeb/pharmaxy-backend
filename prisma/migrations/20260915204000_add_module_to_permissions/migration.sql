-- AlterTable
ALTER TABLE "permissions" ADD COLUMN "module" VARCHAR(100);

-- Backfill module based on name prefix if permissions already exist
UPDATE "permissions" SET "module" = INITCAP(REPLACE(SPLIT_PART("name", '.', 1), '_', ' ')) WHERE "module" IS NULL;

-- Set NOT NULL constraint
ALTER TABLE "permissions" ALTER COLUMN "module" SET NOT NULL;

-- CreateIndex
CREATE INDEX "permissions_module_idx" ON "permissions"("module");
