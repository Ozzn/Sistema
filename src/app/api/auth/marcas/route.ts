import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que Prisma esté bien configurado

// **Método GET para obtener todas las marcas**
export async function GET() {
  try {
    const marcas = await prisma.marca.findMany({
      select: {
        id: true,      // 🔹 Asegura que también se obtenga el ID
        nombre: true,
      },
    });

    return NextResponse.json(marcas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    return NextResponse.json({ message: "Error al obtener marcas" }, { status: 500 });
  }
}


// **Crear una nueva marca**
export async function POST(req: Request) {
  try {
    const { nombre } = await req.json();

    if (!nombre) {
      return NextResponse.json({ message: "El nombre es obligatorio" }, { status: 400 });
    }

    const marcaExistente = await prisma.marca.findUnique({
      where: { nombre },
    });

    if (marcaExistente) {
      return NextResponse.json({ message: "La marca ya existe" }, { status: 400 });
    }

    const nuevaMarca = await prisma.marca.create({
      data: { nombre },
    });

    return NextResponse.json(nuevaMarca, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}
