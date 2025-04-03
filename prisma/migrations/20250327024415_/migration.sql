/*
  Warnings:

  - You are about to drop the column `status` on the `Personal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Personal" DROP COLUMN "status",
ADD COLUMN     "statusId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Personal" ADD CONSTRAINT "Personal_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
