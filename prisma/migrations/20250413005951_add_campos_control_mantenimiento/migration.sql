/*
  Warnings:

  - Added the required column `updatedAt` to the `Mantenimiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mantenimiento"
  ADD COLUMN "duracionTotal" INTEGER,
  ADD COLUMN "estado" TEXT,
  ADD COLUMN "fechaFinalizacion" TIMESTAMP(3),
  ADD COLUMN "fechaInicio" TIMESTAMP(3),
  ADD COLUMN "fechaPausa" TIMESTAMP(3),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
