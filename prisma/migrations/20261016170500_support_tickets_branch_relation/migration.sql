-- DropForeignKey
ALTER TABLE "support_tickets" DROP CONSTRAINT IF EXISTS "support_tickets_pharmacy_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "support_tickets_pharmacy_id_ticket_number_key";

-- AlterTable
ALTER TABLE "support_tickets" RENAME COLUMN "pharmacy_id" TO "branch_id";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "support_tickets_branch_id_idx" ON "support_tickets"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "support_tickets_branch_id_ticket_number_key" ON "support_tickets"("branch_id", "ticket_number");

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
