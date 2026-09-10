/*
  Warnings:

  - You are about to alter the column `discount_percentage` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(5,2)`.
  - You are about to alter the column `tax_percentage` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(5,2)`.

*/
-- AlterTable
ALTER TABLE "branch_products" ALTER COLUMN "selling_price" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "total_spent" SET DEFAULT 0,
ALTER COLUMN "total_spent" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "hold_order_items" ALTER COLUMN "unit_price" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "hold_orders" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "grand_total" SET DEFAULT 0,
ALTER COLUMN "grand_total" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "unit_price" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "line_total" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "invoice_payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "rounding_amount" SET DEFAULT 0,
ALTER COLUMN "rounding_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "grand_total" SET DEFAULT 0,
ALTER COLUMN "grand_total" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "paid_amount" SET DEFAULT 0,
ALTER COLUMN "paid_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "due_amount" SET DEFAULT 0,
ALTER COLUMN "due_amount" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "product_batches" ALTER COLUMN "purchase_price" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "mrp" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "purchase_order_items" ALTER COLUMN "unit_cost" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "discount_percentage" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "tax_percentage" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "line_total" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "purchase_orders" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "shipping_amount" SET DEFAULT 0,
ALTER COLUMN "shipping_amount" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "other_charges" SET DEFAULT 0,
ALTER COLUMN "other_charges" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "grand_total" SET DEFAULT 0,
ALTER COLUMN "grand_total" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "return_items" ALTER COLUMN "refund_amount" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "returns" ALTER COLUMN "refund_amount" SET DEFAULT 0,
ALTER COLUMN "refund_amount" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "subscription_payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "subscription_plans" ALTER COLUMN "price" SET DATA TYPE DECIMAL(19,4);
