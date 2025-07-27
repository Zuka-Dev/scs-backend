-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_complaintId_fkey";

-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "complaintId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
