-- Invoices: Rename cashier_id to user_id
ALTER TABLE "invoices" RENAME COLUMN "cashier_id" TO "user_id";

-- Invoices: Recreate foreign key constraint
ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "invoices_cashier_id_fkey";
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Invoices: Rename index
DROP INDEX IF EXISTS "invoices_cashier_id_idx";
CREATE INDEX "invoices_user_id_idx" ON "invoices"("user_id");


-- Hold Orders: Rename cashier_id to user_id
ALTER TABLE "hold_orders" RENAME COLUMN "cashier_id" TO "user_id";

-- Hold Orders: Recreate foreign key constraint
ALTER TABLE "hold_orders" DROP CONSTRAINT IF EXISTS "hold_orders_cashier_id_fkey";
ALTER TABLE "hold_orders" ADD CONSTRAINT "hold_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Hold Orders: Add index on user_id
CREATE INDEX "hold_orders_user_id_idx" ON "hold_orders"("user_id");


-- Returns: Rename cashier_id to user_id
ALTER TABLE "returns" RENAME COLUMN "cashier_id" TO "user_id";

-- Returns: Recreate foreign key constraint
ALTER TABLE "returns" DROP CONSTRAINT IF EXISTS "returns_cashier_id_fkey";
ALTER TABLE "returns" ADD CONSTRAINT "returns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Returns: Add index on user_id
CREATE INDEX "returns_user_id_idx" ON "returns"("user_id");
