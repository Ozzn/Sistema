/*
  Warnings:

  - You are about to drop the column `statusId` on the `Personal` table. All the data in the column will be lost.
  - You are about to drop the `StatusPersonal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Personal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Personal" DROP CONSTRAINT "Personal_statusId_fkey";

-- DropIndex
DROP INDEX "Personal_email_key";

-- AlterTable
ALTER TABLE "Personal" DROP COLUMN "statusId",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "telefono" DROP NOT NULL;

-- DropTable
DROP TABLE "StatusPersonal";
