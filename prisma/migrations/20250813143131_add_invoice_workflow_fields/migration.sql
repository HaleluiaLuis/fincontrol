-- AlterTable
ALTER TABLE "public"."invoices" ADD COLUMN     "currentStep" "public"."WorkflowStep" NOT NULL DEFAULT 'GABINETE_CONTRATACAO',
ADD COLUMN     "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDENTE';
