/*
  Warnings:

  - The primary key for the `Cargo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cargo` on the `Cargo` table. All the data in the column will be lost.
  - You are about to drop the column `id_cargo` on the `Cargo` table. All the data in the column will be lost.
  - Added the required column `name` to the `Cargo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cargo" DROP CONSTRAINT "Cargo_pkey",
DROP COLUMN "cargo",
DROP COLUMN "id_cargo",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id");
