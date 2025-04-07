// app/api/auth/menus/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Copia de la estructura de menús del frontend
const menuOptions = [
  {
    id: "almacen",
    name: "ALMACEN",
    submenus: [
      { id: "/almacen", name: "Artículos" },
      { id: "/almacen-despacho", name: "Despacho" },
    ],
  },
  {
    id: "data",
    name: "DATA",
    submenus: [
      { id: "/data", name: "Data" },
      { id: "/scanner", name: "Scanner" },
      { id: "/cleandesp", name: "Cleandesp" },
    ],
  },
  {
    id: "estacion",
    name: "ESTACION",
    submenus: [{ id: "/estacion", name: "Estación" }],
  },
  {
    id: "menu",
    name: "OPCIONES AVANZADAS",
    submenus: [{ id: "/menus", name: "Crear Menú" }],
  },
  {
    id: "personal",
    name: "PERSONAL",
    submenus: [
      { id: "/usuario", name: "Usuarios" },
      { id: "/personal", name: "Personal" },
    ],
  },
  {
    id: "proveedor",
    name: "PROVEEDOR",
    submenus: [{ id: "/proveedor", name: "Proveedor" }],
  },
  {
    id: "despacho",
    name: "DESPACHO",
    submenus: [
      { id: "/despacho", name: "Despacho" },
      { id: "/lista-despacho", name: "Lista de Despacho" },
    ],
  },
  {
    id: "flota",
    name: "FLOTA",
    submenus: [
      { id: "/unidades", name: "Unidades" },
      { id: "/mantenimiento", name: "Mantenimiento" },
    ],
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, menus } = body;

    if (!name || !Array.isArray(menus) || menus.length === 0) {
      return Response.json({ message: "Nombre del rol o menús inválidos" }, { status: 400 });
    }

    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return Response.json({ message: "El rol ya existe" }, { status: 400 });
    }

    // Procesar submenús
    const menuEntries = await Promise.all(
      menus
        .filter((menuId: string) => menuId.startsWith("/")) // solo submenús
        .map(async (submenuId: string) => {
          const existingMenu = await prisma.menu.findUnique({ where: { path: submenuId } });
          if (existingMenu) return existingMenu;

          // Buscar el submenú y su categoría en la estructura original
          const parent = menuOptions.find((m) =>
            m.submenus?.some((sub) => sub.id === submenuId)
          );
          const submenu = parent?.submenus?.find((sub) => sub.id === submenuId);

          if (!submenu || !parent) {
            throw new Error(`Submenú ${submenuId} no encontrado`);
          }

          return await prisma.menu.create({
            data: {
              path: submenu.id,
              name: submenu.name,
              category: parent.name, // ← Aquí usamos el nombre del menú padre
            },
          });
        })
    );

    const newRole = await prisma.role.create({
      data: {
        name,
        menus: {
          connect: menuEntries.map((menu) => ({ id: menu.id })),
        },
      },
      include: {
        menus: true,
      },
    });

    return Response.json({
      message: "Rol creado y menús asignados correctamente",
      role: newRole,
    }, { status: 200 });

  } catch (error) {
    console.error("Error al crear rol:", error);
    return Response.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
