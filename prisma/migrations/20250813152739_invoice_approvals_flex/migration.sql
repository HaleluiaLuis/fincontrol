-- DropForeignKey
ALTER TABLE "public"."approvals" DROP CONSTRAINT "approvals_paymentRequestId_fkey";

-- AlterTable
ALTER TABLE "public"."approvals" ADD COLUMN     "invoiceId" TEXT,
ALTER COLUMN "paymentRequestId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "approvals_invoiceId_idx" ON "public"."approvals"("invoiceId");

-- CreateIndex
CREATE INDEX "approvals_paymentRequestId_idx" ON "public"."approvals"("paymentRequestId");

-- AddForeignKey
ALTER TABLE "public"."approvals" ADD CONSTRAINT "approvals_paymentRequestId_fkey" FOREIGN KEY ("paymentRequestId") REFERENCES "public"."payment_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."approvals" ADD CONSTRAINT "approvals_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
