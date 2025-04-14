const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Insertar Status
  await prisma.status.createMany({
    data: [
      { nombre: 'Operativo' },
      { nombre: 'Inoperativo' },
      { nombre: 'Critico' },
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
      { name: 'ANALISTA DE INFORMÁTICA' },
      { name: 'CONSULTOR(A) JURIDICO' },
      { name: 'OBRERO' },
      { name: 'OPERADOR DE RUTA' },
      { name: 'OPERADOR DE GRUA' },
      { name: 'OPERADOR INSTRUCTOR' },
    ],
    skipDuplicates: true,
  });

  // Crear o buscar roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  const mecanicoRole = await prisma.role.upsert({
    where: { name: "mecanico" },
    update: {},
    create: { name: "mecanico" },
  });

  // Status operativo
  const operativoStatus = await prisma.status.upsert({
    where: { nombre: "Operativo" },
    update: {},
    create: { nombre: "Operativo" },
  });

  // Contraseña cifrada
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Crear usuario admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      nick: 'admin',
      nombres: 'Admin',
      apellidos: 'User',
      email: 'admin@gmail.com',
      telefono: '1234567890',
      password: hashedPassword,
      roleId: adminRole.id,
      statusId: operativoStatus.id,
    },
  });

  await prisma.user.update({
    where: { id: adminUser.id },
    data: {
      role: { connect: { id: adminRole.id } },
      status: { connect: { id: operativoStatus.id } },
    },
  });

  // Lista de menús
  const menuItems = [
    { path: "/almacen", name: "Artículos", category: "ALMACEN" },
    { path: "/despacho", name: "Despacho", category: "ALMACEN" },
    { path: "/lista-despacho", name: "Lista de Despacho", category: "ALMACEN" },
    { path: "/estacion", name: "Estación", category: "ESTACION" },
    { path: "/menus", name: "Crear Menú", category: "OPCIONES AVANZADAS" },
    { path: "/usuario", name: "Usuarios", category: "PERSONAL" },
    { path: "/personal", name: "Personal", category: "PERSONAL" },
    { path: "/proveedor", name: "Proveedor", category: "PROVEEDOR" },
    { path: "/unidades", name: "Unidades", category: "FLOTA" },
    { path: "/mantenimiento/registrar", name: "Registrar", category: "MANTENIMIENTO" },
    { path: "/mantenimiento/progreso", name: "Progreso", category: "MANTENIMIENTO" },
    { path: "/mantenimiento/mecanico", name: "Mecánico", category: "MANTENIMIENTO" },
  ];

  for (const item of menuItems) {
    const menu = await prisma.menu.upsert({
      where: { path: item.path },
      update: {},
      create: {
        path: item.path,
        name: item.name,
        category: item.category,
      },
    });

    // Asignar todos los menús al rol admin
    await prisma.role.update({
      where: { id: adminRole.id },
      data: {
        menus: {
          connect: { id: menu.id },
        },
      },
    });

    // Asignar solo los menús de MANTENIMIENTO al rol mecanico
    if (item.category === "MANTENIMIENTO") {
      await prisma.role.update({
        where: { id: mecanicoRole.id },
        data: {
          menus: {
            connect: { id: menu.id },
          },
        },
      });
    }
  }

  console.log("✅ Seed ejecutado correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
