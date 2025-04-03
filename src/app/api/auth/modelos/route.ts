import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que Prisma esté bien configurado

// **Método GET para obtener todos los modelos**
export async function GET() {
  try {
    const modelos = await prisma.modelo.findMany({
      select: {
        id: true,      // 🔹 Asegura que también se obtenga el ID
        nombre: true,  // Obtener nombre
      },
    });

    return NextResponse.json(modelos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener modelos:", error);
    return NextResponse.json({ message: "Error al obtener modelos" }, { status: 500 });
  }
}

// **Método POST para crear un nuevo modelo**
export async function POST(req: Request) {
  try {
    const { nombre } = await req.json();

    if (!nombre) {
      return NextResponse.json({ message: "El nombre es obligatorio" }, { status: 400 });
    }

    // ⚠️ Corrección: Usar `findFirst` en lugar de `findUnique`
    const modeloExistente = await prisma.modelo.findFirst({
      where: { nombre },
    });

    if (modeloExistente) {
      return NextResponse.json({ message: "El modelo ya existe" }, { status: 400 });
    }

    const nuevoModelo = await prisma.modelo.create({
      data: { nombre },
    });

    return NextResponse.json(nuevoModelo, { status: 201 });
  } catch (error) {
    console.error("Error al crear el modelo:", error);
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}
