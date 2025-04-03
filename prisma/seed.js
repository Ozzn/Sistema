const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Insertar Status
  await prisma.status.createMany({
    data: [
      { nombre: 'Operativo' },
      { nombre: 'Inoperativo' },
      { nombre: 'critico' },
      { nombre: 'Mantenimiento' },
      { nombre: 'Vacaciones' },
      { nombre: 'Reposo' },
    ],
    skipDuplicates: true,
  });

  // Insertar Cargos
  await prisma.cargo.createMany({
    data: [
      { name: 'DIRECTOR GENERAL' },
      { name: 'COORDINADOR(A) DE TESORERIA' },
      { name: 'COORDINADOR(A) DE PLANIFICACION Y PRESUPUESTO' },
      { name: 'COORDINADOR DE RUTA ESTUDIANTIL' },
      { name: 'COORDINADOR DE LOGÍSTICA (E)' },
      { name: 'COORDINADOR DE MANTENIMIENTO DE VEHÍCULOS (E)' },
      { name: 'COORDINADOR DE BIENES' },
      { name: 'COORDINADOR DE INFORMÁTICA (E)' },
      { name: 'COORDINADOR DE SERVICIOS GENERALES' },
      { name: 'COORDINADORA DE CONTABILIDAD' },
      { name: 'COORDINADOR DE ALMACEN DE REPUESTOS' },
      { name: 'COORDINADOR DE RECURSOS HUMANOS' },
      { name: 'COORDINADOR(A) DE COMPRAS' },
      { name: 'DIRECTOR(A) DE ADMINISTRACION' },
      { name: 'DIRECTOR(A) DE OPERACIONES' },
      { name: 'ANALISTA DE RECURSOS HUMANOS' },
      { name: 'ANALISTA FINANCIERO' },
      { name: 'ANALISTA DE SISTEMA' },
      { name: 'ANALISTA FINANCIERO' },
      { name: 'ANALISTA DE INFORMÁTICA' },
      { name: 'CONSULTOR(A) JURIDICO' },
      { name: 'OBRERO' },
      { name: 'OPERADOR DE RUTA' },
      { name: 'OPERADOR DE GRUA' },
      { name: 'OPERADOR INSTRUCTOR' },
    ],
    skipDuplicates: true,
  });

  console.log('Datos insertados correctamente en status y cargo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
