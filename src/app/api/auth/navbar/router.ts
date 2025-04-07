// pages/api/auth/navbar.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Leer el cuerpo de la solicitud para obtener el userId
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "No userId provided" }, { status: 400 });
    }

    // Obtener el usuario con el rol y los menús asociados
    const userWithRole = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        role: {
          include: {
            menus: true,
          },
        },
      },
    });

    if (!userWithRole) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    // Mapeamos los menús del rol del usuario
    const menus = userWithRole.role.menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      path: menu.path,
    }));

    return NextResponse.json({ menus });
  } catch (error) {
    console.error("Error al obtener los menús:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
