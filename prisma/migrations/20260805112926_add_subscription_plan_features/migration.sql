/*
  Warnings:

  - You are about to drop the column `trial_ends_at` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "allow_nearby_inventory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allow_quick_sale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "report_history_months" INTEGER,
ADD COLUMN     "trial_days" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "trial_ends_at",
ADD COLUMN     "cancellation_reason" VARCHAR(500),
ADD COLUMN     "trial_expires_at" TIMESTAMP(3);
