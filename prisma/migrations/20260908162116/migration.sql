/*
  Warnings:

  - You are about to alter the column `selling_price` on the `branch_products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `loyalty_points` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `total_spent` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `quantity` on the `hold_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `unit_price` on the `hold_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `discount_amount` on the `hold_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `tax_amount` on the `hold_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `subtotal` on the `hold_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `subtotal` on the `hold_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `discount_amount` on the `hold_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `tax_amount` on the `hold_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `grand_total` on the `hold_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `quantity` on the `invoice_item_batches` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `quantity` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `unit_price` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `discount_amount` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `tax_amount` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `line_total` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `amount` on the `invoice_payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `subtotal` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `discount_amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `tax_amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `rounding_amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `grand_total` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `paid_amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `due_amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `purchase_price` on the `product_batches` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `mrp` on the `product_batches` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `ordered_quantity` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `fulfilled_quantity` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `received_quantity` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `unit_cost` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `discount_percentage` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - You are about to alter the column `discount_amount` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `tax_percentage` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - You are about to alter the column `tax_amount` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `line_total` on the `purchase_order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `subtotal` on the `purchase_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `discount_amount` on the `purchase_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `tax_amount` on the `purchase_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `shipping_amount` on the `purchase_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `other_charges` on the `purchase_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `grand_total` on the `purchase_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `quantity` on the `return_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `refund_amount` on the `return_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `refund_amount` on the `returns` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `quantity_before` on the `stock_adjustment_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `quantity_after` on the `stock_adjustment_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `adjustment_quantity` on the `stock_adjustment_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `quantity` on the `stock_transfer_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `amount` on the `subscription_payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `price` on the `subscription_plans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "branch_products" ALTER COLUMN "selling_price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "loyalty_points" SET DEFAULT 0,
ALTER COLUMN "loyalty_points" SET DATA TYPE INTEGER,
ALTER COLUMN "total_spent" SET DEFAULT 0,
ALTER COLUMN "total_spent" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "hold_order_items" ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "unit_price" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "subtotal" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "hold_orders" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "grand_total" SET DEFAULT 0,
ALTER COLUMN "grand_total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "invoice_item_batches" ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "unit_price" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "line_total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "invoice_payments" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "rounding_amount" SET DEFAULT 0,
ALTER COLUMN "rounding_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "grand_total" SET DEFAULT 0,
ALTER COLUMN "grand_total" SET DATA TYPE INTEGER,
ALTER COLUMN "paid_amount" SET DEFAULT 0,
ALTER COLUMN "paid_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "due_amount" SET DEFAULT 0,
ALTER COLUMN "due_amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "product_batches" ALTER COLUMN "purchase_price" SET DATA TYPE INTEGER,
ALTER COLUMN "mrp" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "purchase_order_items" ALTER COLUMN "ordered_quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "fulfilled_quantity" SET DEFAULT 0,
ALTER COLUMN "fulfilled_quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "received_quantity" SET DEFAULT 0,
ALTER COLUMN "received_quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "unit_cost" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_percentage" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "tax_percentage" SET DATA TYPE INTEGER,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "line_total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "purchase_orders" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "tax_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "shipping_amount" SET DEFAULT 0,
ALTER COLUMN "shipping_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "other_charges" SET DEFAULT 0,
ALTER COLUMN "other_charges" SET DATA TYPE INTEGER,
ALTER COLUMN "grand_total" SET DEFAULT 0,
ALTER COLUMN "grand_total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "return_items" ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "refund_amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "returns" ALTER COLUMN "refund_amount" SET DEFAULT 0,
ALTER COLUMN "refund_amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "stock_adjustment_items" ALTER COLUMN "quantity_before" SET DATA TYPE INTEGER,
ALTER COLUMN "quantity_after" SET DATA TYPE INTEGER,
ALTER COLUMN "adjustment_quantity" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "stock_transfer_items" ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "subscription_payments" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "subscription_plans" ALTER COLUMN "price" SET DATA TYPE INTEGER;
