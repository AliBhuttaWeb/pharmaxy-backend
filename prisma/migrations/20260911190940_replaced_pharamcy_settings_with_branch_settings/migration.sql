/*
  Warnings:

  - You are about to drop the `pharmacy_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pharmacy_settings" DROP CONSTRAINT "pharmacy_settings_pharmacy_id_fkey";

-- DropTable
DROP TABLE "pharmacy_settings";

-- CreateTable
CREATE TABLE "branch_settings" (
    "id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "timezone" VARCHAR(100) NOT NULL DEFAULT 'Asia/Karachi',
    "currency" VARCHAR(10) NOT NULL DEFAULT 'PKR',
    "receipt_header" TEXT,
    "receipt_footer" TEXT,
    "print_logo" BOOLEAN NOT NULL DEFAULT true,
    "print_tax_number" BOOLEAN NOT NULL DEFAULT true,
    "print_phone" BOOLEAN NOT NULL DEFAULT true,
    "print_address" BOOLEAN NOT NULL DEFAULT true,
    "print_qr_code" BOOLEAN NOT NULL DEFAULT false,
    "show_cashier_name" BOOLEAN NOT NULL DEFAULT true,
    "minimum_stock_quantity" INTEGER NOT NULL DEFAULT 10,
    "critical_stock_quantity" INTEGER NOT NULL DEFAULT 5,
    "expiry_alert_before_days" INTEGER NOT NULL DEFAULT 30,
    "enable_stock_sharing" BOOLEAN NOT NULL DEFAULT false,
    "share_inventory_details" BOOLEAN NOT NULL DEFAULT false,
    "allow_reservations" BOOLEAN NOT NULL DEFAULT false,
    "search_radius" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "radius_unit" "radius_unit" NOT NULL DEFAULT 'KM',
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "sms_notifications" BOOLEAN NOT NULL DEFAULT false,
    "push_notifications" BOOLEAN NOT NULL DEFAULT true,
    "in_app_notifications" BOOLEAN NOT NULL DEFAULT true,
    "low_stock_alert" BOOLEAN NOT NULL DEFAULT true,
    "expiry_alert" BOOLEAN NOT NULL DEFAULT true,
    "purchase_alert" BOOLEAN NOT NULL DEFAULT true,
    "sale_alert" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branch_settings_branch_id_key" ON "branch_settings"("branch_id");

-- AddForeignKey
ALTER TABLE "branch_settings" ADD CONSTRAINT "branch_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
