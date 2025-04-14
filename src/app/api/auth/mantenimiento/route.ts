import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Crear un nuevo mantenimiento (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      unidad,
      rutaUnidad,
      operador,
      mecanico,
      kilometraje,
      tipo,
      prioridad,
      fechaEntrada,
      diagnostico,
      recomendacion,
      observacionOperador,
      observacionSupervisor,
    } = body;

    if (!unidad || !operador || !mecanico || isNaN(parseInt(kilometraje))) {
      return NextResponse.json(
        { message: "Datos inválidos o incompletos." },
        { status: 400 }
      );
    }

    // Crear el mantenimiento
    const mantenimiento = await prisma.mantenimiento.create({
      data: {
        unidad: { connect: { id: parseInt(unidad) } },
        operador: { connect: { id: parseInt(operador) } },
        mecanico: { connect: { id: parseInt(mecanico) } },
        rutaUnidad,
        kilometraje: parseInt(kilometraje),
        tipo,
        prioridad,
        fechaEntrada: new Date(fechaEntrada),
        diagnostico,
        recomendacion,
        observacionOperador,
        observacionSupervisor,
      },
    });

    // Cambiar el status de la unidad a 4 (Mantenimiento)
    await prisma.unidad.update({
      where: { id: parseInt(unidad) },
      data: { statusId: 4 },
    });

    return NextResponse.json(mantenimiento); // ✅ Retorna el objeto creado
  } catch (error) {
    console.error("Error en el registro de mantenimiento:", error);
    return NextResponse.json(
      { message: "Error al registrar mantenimiento." },
      { status: 500 }
    );
  }
}

// Obtener todos los mantenimientos (GET)
export async function GET() {
  try {
    const mantenimientos = await prisma.mantenimiento.findMany({
      include: {
        unidad: {
          include: {
            marca: true,
            modelo: true,
            status: true,
          },
        },
        operador: true,
        mecanico: true,
      },
    });

    return NextResponse.json(mantenimientos); // ✅ Retorna directamente el array
  } catch (error) {
    console.error("Error al obtener mantenimientos:", error);
    return NextResponse.json(
      { message: "Error al obtener mantenimientos." },
      { status: 500 }
    );
  }
}
