-- CreateTable
CREATE TABLE "Mantenimiento" (
    "id" SERIAL NOT NULL,
    "unidadId" INTEGER NOT NULL,
    "operadorId" INTEGER NOT NULL,
    "mecanicoId" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaEntrada" TIMESTAMP(3) NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "recomendacion" TEXT NOT NULL,
    "observacionOperador" TEXT NOT NULL,
    "observacionSupervisor" TEXT NOT NULL,
    "rutaUnidad" TEXT NOT NULL,

    CONSTRAINT "Mantenimiento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mantenimiento" ADD CONSTRAINT "Mantenimiento_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mantenimiento" ADD CONSTRAINT "Mantenimiento_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mantenimiento" ADD CONSTRAINT "Mantenimiento_mecanicoId_fkey" FOREIGN KEY ("mecanicoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
