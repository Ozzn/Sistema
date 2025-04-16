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
      mecanico, // este es el ID del usuario con rol de mecánico
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

    // 1. Crear el mantenimiento
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

    // 2. Cambiar el status de la unidad a 4 (Mantenimiento)
    await prisma.unidad.update({
      where: { id: parseInt(unidad) },
      data: { statusId: 4 },
    });

    // 3. Obtener el teléfono del usuario mecánico
    const mecanicoUsuario = await prisma.user.findUnique({
      where: { id: parseInt(mecanico) },
    });

    const telefono = mecanicoUsuario?.telefono;

    if (telefono) {
      const mensaje = `🛠️ Nuevo mantenimiento asignado\nUnidad: ${unidad}\nTipo: ${tipo}\nDiagnóstico: ${diagnostico}`;

      // 4. Enviar notificación
      await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/notificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: telefono,
          message: mensaje,
        }),
      });
    }

    return NextResponse.json(mantenimiento); // ✅ Retorna el objeto creado
  } catch (error) {
    console.error("Error en el registro de mantenimiento:", error);
    return NextResponse.json(
      { message: "Error al registrar mantenimiento." },
      { status: 500 }
    );
  }
}
