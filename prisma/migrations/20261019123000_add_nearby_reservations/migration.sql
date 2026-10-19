-- CreateEnum
CREATE TYPE "nearby_reservation_status" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "nearby_reservations" (
    "id" UUID NOT NULL,
    "reservation_number" VARCHAR(50) NOT NULL,
    "requesting_branch_id" UUID NOT NULL,
    "target_branch_id" UUID NOT NULL,
    "branch_product_id" UUID NOT NULL,
    "product_batch_id" UUID,
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
CREATE INDEX "nearby_reservations_product_batch_id_idx" ON "nearby_reservations"("product_batch_id");

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
ALTER TABLE "nearby_reservations" ADD CONSTRAINT "nearby_reservations_product_batch_id_fkey" FOREIGN KEY ("product_batch_id") REFERENCES "product_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
