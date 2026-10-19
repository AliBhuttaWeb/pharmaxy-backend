-- AlterTable: Rename product_batches to branch_product_batches and product_batch_id columns to branch_product_batch_id
ALTER TABLE "product_batches" RENAME TO "branch_product_batches";
ALTER TABLE "branch_product_batches" RENAME CONSTRAINT "product_batches_pkey" TO "branch_product_batches_pkey";
ALTER INDEX "product_batches_branch_product_id_idx" RENAME TO "branch_product_batches_branch_product_id_idx";
ALTER INDEX "product_batches_expiry_date_idx" RENAME TO "branch_product_batches_expiry_date_idx";
ALTER INDEX "product_batches_batch_number_idx" RENAME TO "branch_product_batches_batch_number_idx";
ALTER INDEX "product_batches_branch_product_id_batch_number_key" RENAME TO "branch_product_batches_branch_product_id_batch_number_key";
ALTER TABLE "branch_product_batches" RENAME CONSTRAINT "product_batches_branch_product_id_fkey" TO "branch_product_batches_branch_product_id_fkey";
ALTER TABLE "branch_product_batches" RENAME CONSTRAINT "product_batches_purchase_order_item_id_fkey" TO "branch_product_batches_purchase_order_item_id_fkey";

ALTER TABLE "invoice_item_batches" RENAME COLUMN "product_batch_id" TO "branch_product_batch_id";
ALTER INDEX "invoice_item_batches_product_batch_id_idx" RENAME TO "invoice_item_batches_branch_product_batch_id_idx";
ALTER TABLE "invoice_item_batches" RENAME CONSTRAINT "invoice_item_batches_product_batch_id_fkey" TO "invoice_item_batches_branch_product_batch_id_fkey";

ALTER TABLE "stock_adjustment_items" RENAME COLUMN "product_batch_id" TO "branch_product_batch_id";
ALTER TABLE "stock_adjustment_items" RENAME CONSTRAINT "stock_adjustment_items_product_batch_id_fkey" TO "stock_adjustment_items_branch_product_batch_id_fkey";

ALTER TABLE "stock_transfer_items" RENAME COLUMN "product_batch_id" TO "branch_product_batch_id";
ALTER INDEX "stock_transfer_items_product_batch_id_idx" RENAME TO "stock_transfer_items_branch_product_batch_id_idx";
ALTER TABLE "stock_transfer_items" RENAME CONSTRAINT "stock_transfer_items_product_batch_id_fkey" TO "stock_transfer_items_branch_product_batch_id_fkey";

-- CreateEnum
CREATE TYPE "nearby_reservation_status" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "nearby_reservations" (
    "id" UUID NOT NULL,
    "reservation_number" VARCHAR(50) NOT NULL,
    "requesting_branch_id" UUID NOT NULL,
    "target_branch_id" UUID NOT NULL,
    "branch_product_id" UUID NOT NULL,
    "branch_product_batch_id" UUID,
    "quantity" INTEGER NOT NULL,
    "customer_name" VARCHAR(150),
    "customer_phone" VARCHAR(30),
    "notes" TEXT,
    "status" "nearby_reservation_status" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "responded_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nearby_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nearby_reservations_reservation_number_key" ON "nearby_reservations"("reservation_number");

-- CreateIndex
CREATE INDEX "nearby_reservations_requesting_branch_id_idx" ON "nearby_reservations"("requesting_branch_id");

-- CreateIndex
CREATE INDEX "nearby_reservations_target_branch_id_idx" ON "nearby_reservations"("target_branch_id");

-- CreateIndex
CREATE INDEX "nearby_reservations_branch_product_id_idx" ON "nearby_reservations"("branch_product_id");

-- CreateIndex
CREATE INDEX "nearby_reservations_branch_product_batch_id_idx" ON "nearby_reservations"("branch_product_batch_id");

-- CreateIndex
CREATE INDEX "nearby_reservations_status_idx" ON "nearby_reservations"("status");

-- CreateIndex
CREATE INDEX "nearby_reservations_expires_at_idx" ON "nearby_reservations"("expires_at");

-- AddForeignKey
ALTER TABLE "nearby_reservations" ADD CONSTRAINT "nearby_reservations_requesting_branch_id_fkey" FOREIGN KEY ("requesting_branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nearby_reservations" ADD CONSTRAINT "nearby_reservations_target_branch_id_fkey" FOREIGN KEY ("target_branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nearby_reservations" ADD CONSTRAINT "nearby_reservations_branch_product_id_fkey" FOREIGN KEY ("branch_product_id") REFERENCES "branch_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nearby_reservations" ADD CONSTRAINT "nearby_reservations_branch_product_batch_id_fkey" FOREIGN KEY ("branch_product_batch_id") REFERENCES "branch_product_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
