/*
  Warnings:

  - The primary key for the `Cargo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Cargo` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Cargo` table. All the data in the column will be lost.
  - You are about to drop the `Departamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Personal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cargo` to the `Cargo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cargo` to the `Cargo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Personal" DROP CONSTRAINT "Personal_cargoId_fkey";

-- DropForeignKey
ALTER TABLE "Personal" DROP CONSTRAINT "Personal_departamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Personal" DROP CONSTRAINT "Personal_statusId_fkey";

-- AlterTable
ALTER TABLE "Cargo" DROP CONSTRAINT "Cargo_pkey",
DROP COLUMN "id",
DROP COLUMN "nombre",
ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "id_cargo" INTEGER NOT NULL,
ADD CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id_cargo");

-- DropTable
DROP TABLE "Departamento";

-- DropTable
DROP TABLE "Personal";
